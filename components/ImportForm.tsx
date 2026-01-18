// components/ImportForm.tsx
'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { PLATFORMS, getBrandsByPlatform, getBranchesByPlatformAndBrand } from '@/lib/brandBranchData'
import ConfirmationModal from './ConfirmationModal'
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
          text: `Data berhasil dikirim! Total records: ${data.recordCount}`,
        })
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
    </div>
  )
}
