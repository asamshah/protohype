'use client';

import styles from './CaptureControls.module.css';

export default function CaptureControls({
  includeFrame,
  onIncludeFrameChange,
  isRecording,
  isPaused,
  recordingTime,
}) {
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Capture</span>

      <div className={styles.frameToggle}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={includeFrame}
            onChange={(e) => onIncludeFrameChange(e.target.checked)}
          />
          <span className={styles.checkmark} />
          <span className={styles.checkLabel}>Include device frame</span>
        </label>
      </div>

      {isRecording && (
        <div className={styles.recordingIndicator}>
          <span className={styles.recordingDot} />
          <span className={styles.timer}>{formatTime(recordingTime)}</span>
          {isPaused && <span className={styles.pausedLabel}>Paused</span>}
        </div>
      )}
    </div>
  );
}
