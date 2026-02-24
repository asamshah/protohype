'use client';

import styles from './BackgroundPicker.module.css';

const presets = [
  { id: 'transparent', label: 'Transparent', value: 'transparent', type: 'transparent' },
  { id: 'dark', label: 'Dark', value: '#0a0a0b', type: 'solid' },
  { id: 'light', label: 'Light', value: '#f5f5f7', type: 'solid' },
  { id: 'blue', label: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', type: 'gradient' },
  { id: 'sunset', label: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', type: 'gradient' },
  { id: 'forest', label: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', type: 'gradient' },
  { id: 'midnight', label: 'Midnight', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', type: 'gradient' },
  { id: 'peach', label: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', type: 'gradient' },
];

export default function BackgroundPicker({
  background,
  onBackgroundChange,
  hidden,
  onScreenshot,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  isRecording,
  isPaused,
  recordingTime,
  disabled,
  includeFrame,
  onIncludeFrameChange,
}) {
  if (hidden) return null;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.panel}>
        <div className={styles.swatches}>
          {presets.map((preset) => (
            <button
              key={preset.id}
              className={`${styles.swatch} ${background === preset.value ? styles.active : ''}`}
              style={
                preset.type === 'transparent'
                  ? {
                      backgroundColor: '#ffffff',
                      backgroundImage: 'radial-gradient(circle, #c0c0c0 1px, transparent 1px)',
                      backgroundSize: '6px 6px',
                    }
                  : preset.type === 'gradient'
                  ? {
                      backgroundImage: preset.value,
                    }
                  : {
                      backgroundColor: preset.value,
                    }
              }
              title={preset.label}
              onClick={() => onBackgroundChange(preset.value)}
            />
          ))}
          <label className={styles.customSwatch} title="Custom color">
            <input
              type="color"
              className={styles.hiddenInput}
              value={background.startsWith('#') ? background : '#0a0a0b'}
              onChange={(e) => onBackgroundChange(e.target.value)}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </label>

          <div className={styles.divider} />

          <div
            className={styles.frameToggle}
            onClick={() => onIncludeFrameChange(!includeFrame)}
            title={includeFrame ? 'Hide device frame' : 'Show device frame'}
          >
            <div className={`${styles.frameToggleTrack} ${includeFrame ? styles.on : ''}`}>
              <div className={styles.frameToggleThumb} />
            </div>
            <span className={styles.frameToggleLabel}>Frame</span>
          </div>

          <div className={styles.divider} />

          <button
            className={styles.actionBtn}
            onClick={onScreenshot}
            disabled={disabled || isRecording}
            title="Screenshot"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {!isRecording ? (
            <button
              className={`${styles.actionBtn} ${styles.recordAction}`}
              onClick={onStartRecording}
              disabled={disabled}
              title="Record"
            >
              <span className={styles.recordDot} />
            </button>
          ) : (
            <>
              <span className={styles.recordingTimer}>
                <span className={styles.recordingDot} />
                {formatTime(recordingTime)}
                {isPaused && <span className={styles.pausedLabel}>Paused</span>}
              </span>
              <button
                className={styles.actionBtn}
                onClick={isPaused ? onStartRecording : onPauseRecording}
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="3" width="4" height="18" rx="1" />
                    <rect x="15" y="3" width="4" height="18" rx="1" />
                  </svg>
                )}
              </button>
              <button
                className={`${styles.actionBtn} ${styles.stopAction}`}
                onClick={onStopRecording}
                title="Stop recording"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
