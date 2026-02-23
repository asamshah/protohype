'use client';

import { useState } from 'react';
import styles from './ExportModal.module.css';

export default function ExportModal({ videoBlob, onClose, onExport }) {
  const [format, setFormat] = useState('webm');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  async function handleExport() {
    setError('');
    if (format === 'webm') {
      onExport(videoBlob, 'webm');
      return;
    }
    setConverting(true);
    try {
      await onExport(videoBlob, format, setProgress);
    } catch (err) {
      console.error('Export failed:', err);
      setError(`Conversion failed: ${err.message}`);
      setConverting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={converting ? undefined : onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Export Recording</h3>
          <button className={styles.closeBtn} onClick={onClose} disabled={converting}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.formats}>
          <button
            className={`${styles.formatCard} ${format === 'webm' ? styles.selected : ''}`}
            onClick={() => !converting && setFormat('webm')}
            disabled={converting}
          >
            <span className={styles.formatName}>WebM</span>
            <span className={styles.formatDesc}>Native browser format, instant download</span>
          </button>
          <button
            className={`${styles.formatCard} ${format === 'mp4' ? styles.selected : ''}`}
            onClick={() => !converting && setFormat('mp4')}
            disabled={converting}
          >
            <span className={styles.formatName}>MP4</span>
            <span className={styles.formatDesc}>Universal format, server-side conversion</span>
          </button>
          <button
            className={`${styles.formatCard} ${format === 'gif' ? styles.selected : ''}`}
            onClick={() => !converting && setFormat('gif')}
            disabled={converting}
          >
            <span className={styles.formatName}>GIF</span>
            <span className={styles.formatDesc}>Animated image, great for quick demos</span>
          </button>
        </div>

        {converting && (
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            <span className={styles.progressText}>
              Converting... {Math.round(progress)}%
            </span>
          </div>
        )}

        {error && (
          <div className={styles.errorMsg}>{error}</div>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={converting}>
            Cancel
          </button>
          <button
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={converting}
          >
            {converting ? 'Converting...' : `Export as ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
