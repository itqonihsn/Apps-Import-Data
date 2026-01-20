// components/ImportForm.tsx
'use client'

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react'
import { PLATFORMS, getBrandsByPlatform, getBranchesByPlatformAndBrand } from '@/lib/brandBranchData'
import ConfirmationModal from './ConfirmationModal'
import SuccessModal from './SuccessModal'
import styles from '@/styles/Form.module.css'

interface FormData {
  platform: string
  brand: string
  branch: string
  csvFile: File | null
  dataType: 'order' | 'withdrawal' | 'balance'
}

export default function ImportForm() {
  const [formData, setFormData] = useState<FormData>({
    platform: '',
    brand: '',
    branch: '',
    csvFile: null,
    dataType: 'order',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [callbackMessage, setCallbackMessage] = useState<string>('')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const brands = formData.platform ? getBrandsByPlatform(formData.platform) : []
  const branches =
    formData.platform && formData.brand
      ? getBranchesByPlatformAndBrand(formData.platform, formData.brand)
      : []

  const handlePlatformChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newPlatform = e.target.value
    setFormData({
      ...formData,
      platform: newPlatform,
      brand: '', // Reset brand when platform changes
      branch: '', // Reset branch when platform changes
    })
  }

  const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value
    setFormData({
      ...formData,
      brand: newBrand,
      branch: '', // Reset branch when brand changes
    })
  }

  const handleBranchChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      branch: e.target.value,
    })
  }

  const handleDataTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      dataType: e.target.value as 'order' | 'withdrawal' | 'balance',
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        csvFile: e.target.files[0],
      })
    }
  }

  const handleSubmitClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.platform || !formData.brand || !formData.branch || !formData.csvFile) {
      setMessage({
        type: 'error',
        text: 'Mohon lengkapi semua field dan pilih file CSV',
      })
      return
    }

    // Show confirmation modal instead of submitting immediately
    setShowConfirmation(true)
  }

  const handleConfirmImport = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const form = new FormData()
      form.append('platform', formData.platform)
      form.append('brand', formData.brand)
      form.append('branch', formData.branch)
      form.append('dataType', formData.dataType)
      form.append('csvFile', formData.csvFile!)

      const response = await fetch('/api/import', {
        method: 'POST',
        body: form,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Data berhasil dikirim! Total records: ${data.recordCount}. Menunggu konfirmasi dari server...`,
        })
        
        // Simpan sessionId dan mulai polling
        if (data.sessionId) {
          setSessionId(data.sessionId)
          startPolling(data.sessionId)
        }
        
        // Reset form
        setFormData({
          platform: '',
          brand: '',
          branch: '',
          csvFile: null,
          dataType: 'order',
        })
        setShowConfirmation(false)
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Gagal mengirim data',
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  // Polling untuk cek status callback
  const startPolling = (id: string) => {
    // Clear existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Poll setiap 2 detik
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/import-status?sessionId=${encodeURIComponent(id)}`)
        const data = await response.json()

        if (data.found && data.status === 'success') {
          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }

          // Show success modal
          setCallbackMessage(data.message || 'Data sudah berhasil masuk ke database dan di update')
          setShowSuccessModal(true)
          setSessionId(null)
        } else if (data.found && data.status === 'error') {
          // Stop polling on error
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }

          setMessage({
            type: 'error',
            text: data.message || 'Terjadi kesalahan saat memproses data',
          })
          setSessionId(null)
        }
      } catch (error) {
        console.error('Error polling status:', error)
      }
    }, 2000) // Poll every 2 seconds

    // Stop polling after 5 minutes (timeout)
    setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
        setSessionId(null)
        setMessage({
          type: 'error',
          text: 'Timeout: Tidak menerima konfirmasi dari server setelah 5 menit',
        })
      }
    }, 5 * 60 * 1000)
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const handleImportAgain = () => {
    setShowSuccessModal(false)
    setCallbackMessage('')
    // Reload page untuk reset form
    window.location.href = 'https://apps-import-data.vercel.app/'
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    setCallbackMessage('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Aplikasi Form Import Data Penjualan Marketplace Hegemoni Group</h1>

        <form onSubmit={handleSubmitClick} className={styles.form}>
          {/* Platform Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="platform" className={styles.label}>
              Platform *
            </label>
            <select
              id="platform"
              value={formData.platform}
              onChange={handlePlatformChange}
              className={styles.input}
              required
            >
              <option value="">-- Pilih Platform --</option>
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="brand" className={styles.label}>
              Brand *
            </label>
            <select
              id="brand"
              value={formData.brand}
              onChange={handleBrandChange}
              className={styles.input}
              required
              disabled={!formData.platform}
            >
              <option value="">-- Pilih Brand --</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="branch" className={styles.label}>
              Cabang *
            </label>
            <select
              id="branch"
              value={formData.branch}
              onChange={handleBranchChange}
              className={styles.input}
              required
              disabled={!formData.brand}
            >
              <option value="">-- Pilih Cabang --</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Data Type Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="dataType" className={styles.label}>
              Jenis Data *
            </label>
            <select
              id="dataType"
              value={formData.dataType}
              onChange={handleDataTypeChange}
              className={styles.input}
            >
              <option value="order">Data Order</option>
              <option value="withdrawal">Data Penarikan</option>
              <option value="balance">Data Saldo</option>
            </select>
          </div>

          {/* CSV File Upload */}
          <div className={styles.formGroup}>
            <label htmlFor="csvFile" className={styles.label}>
              File CSV *
            </label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className={styles.fileInput}
              required
            />
            {formData.csvFile && (
              <p className={styles.fileName}>File: {formData.csvFile.name}</p>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !formData.platform || !formData.brand || !formData.branch}
          >
            {loading ? 'Memproses...' : 'Lanjutkan ke Verifikasi'}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        platform={formData.platform}
        brand={formData.brand}
        branch={formData.branch}
        dataType={formData.dataType}
        fileName={formData.csvFile?.name || ''}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelConfirmation}
        isLoading={loading}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={callbackMessage}
        onImportAgain={handleImportAgain}
        onClose={handleCloseSuccessModal}
      />
    </div>
  )
}
