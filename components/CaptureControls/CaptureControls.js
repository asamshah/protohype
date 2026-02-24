'use client';

import styles from './CaptureControls.module.css';

export default function CaptureControls({
  isRecording,
  isPaused,
  recordingTime,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
}) {
  if (!isRecording) return null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Recording</span>
      <div className={styles.recordingControls}>
        <div className={styles.recordingIndicator}>
          <span className={styles.recordingDot} />
          <span className={styles.timer}>{formatTime(recordingTime)}</span>
          {isPaused && <span className={styles.pausedLabel}>Paused</span>}
        </div>
        <div className={styles.recordingButtons}>
          <button
            className={styles.pauseBtn}
            onClick={isPaused ? onResumeRecording : onPauseRecording}
          >
            {isPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="3" width="4" height="18" rx="1" />
                <rect x="15" y="3" width="4" height="18" rx="1" />
              </svg>
            )}
          </button>
          <button className={styles.stopBtn} onClick={onStopRecording}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
