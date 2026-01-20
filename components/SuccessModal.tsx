// components/SuccessModal.tsx
'use client'

import { useEffect, useState } from 'react'
import styles from '@/styles/Modal.module.css'

interface SuccessModalProps {
  isOpen: boolean
  message: string
  onImportAgain: () => void
  onClose: () => void
}

export default function SuccessModal({
  isOpen,
  message,
  onImportAgain,
  onClose,
}: SuccessModalProps) {
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setShowThankYou(false)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNo = () => {
    setShowThankYou(true)
  }

  const handleCloseThankYou = () => {
    setShowThankYou(false)
    onClose()
  }

  // Thank You Modal
  if (showThankYou) {
    return (
      <div className={styles.overlay} onClick={handleCloseThankYou}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalContent}>
            <div className={`${styles.successIcon} ${styles.thankYou}`}>😊 ❤️</div>
            <h2 className={styles.modalTitle} style={{ color: '#22c55e' }}>Terima Kasih!</h2>
            <p className={styles.modalMessage} style={{ fontSize: '18px', lineHeight: '1.8' }}>
              Terima kasih sudah import data hari ini, selamat menjalani kegiatan selanjutnya 😊 ❤️
            </p>
            
            <div className={styles.modalActions} style={{ marginTop: '32px' }}>
              <button
                type="button"
                onClick={handleCloseThankYou}
                className={styles.confirmButton}
                style={{ width: '100%', maxWidth: '200px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Success Modal
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContent}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.modalTitle}>Import Berhasil!</h2>
          <p className={styles.modalMessage}>{message}</p>
          
          <div className={styles.modalActions}>
            <p className={styles.questionText}>Import Data Lagi?</p>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={onImportAgain}
                className={styles.confirmButton}
              >
                Ya
              </button>
              <button
                type="button"
                onClick={handleNo}
                className={styles.cancelButton}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
