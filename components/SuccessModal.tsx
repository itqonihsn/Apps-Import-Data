// components/SuccessModal.tsx
'use client'

import { useEffect } from 'react'
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNo = () => {
    alert('Terima kasih, selamat menjalani kegiatan selanjutnya 😊')
    onClose()
  }

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
