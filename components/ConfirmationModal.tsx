// components/ConfirmationModal.tsx
'use client'

import { FC } from 'react'
import styles from '@/styles/Modal.module.css'

interface ConfirmationModalProps {
  isOpen: boolean
  platform: string
  brand: string
  branch: string
  dataType: string
  fileName: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  platform,
  brand,
  branch,
  dataType,
  fileName,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const dataTypeLabel = {
    order: 'Data Order',
    withdrawal: 'Data Penarikan',
    balance: 'Data Saldo',
  }[dataType as keyof typeof dataTypeLabel] || dataType

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onCancel} />

      {/* Modal */}
      <div className={styles.modal}>
        <div className={styles.content}>
          <h2 className={styles.title}>Verifikasi Import Data</h2>

          <p className={styles.message}>
            Apakah Anda yakin untuk import dengan detail data berikut?
          </p>

          {/* Details */}
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Platform:</span>
              <span className={styles.value}>{platform}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Brand:</span>
              <span className={styles.value}>{brand}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Cabang:</span>
              <span className={styles.value}>{branch}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Jenis Data:</span>
              <span className={styles.value}>{dataTypeLabel}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>File CSV:</span>
              <span className={styles.value}>{fileName}</span>
            </div>
          </div>

          <p className={styles.warning}>
            ⚠️ Mohon periksa kembali detail di atas sebelum melanjutkan import
          </p>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button
              className={styles.cancelBtn}
              onClick={onCancel}
              disabled={isLoading}
            >
              Tidak (Perbaiki)
            </button>
            <button
              className={styles.confirmBtn}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Mengimport...' : 'Ya, Lanjutkan Import'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
