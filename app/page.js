'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './page.module.css';
import URLInput from '@/components/URLInput/URLInput';
import DevicePicker from '@/components/DevicePicker/DevicePicker';
import DevicePreview from '@/components/DevicePreview/DevicePreview';
import BackgroundPicker from '@/components/BackgroundPicker/BackgroundPicker';
import CaptureControls from '@/components/CaptureControls/CaptureControls';
import ExportModal from '@/components/ExportModal/ExportModal';
import useScreenshot from '@/hooks/useScreenshot';
import useRecorder from '@/hooks/useRecorder';
import { downloadBlob } from '@/utils/capture';
import { convertToMp4, convertToGif } from '@/utils/convert';
import devices from '@/data/devices';

export default function Home() {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('mobile');
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [background, setBackground] = useState('transparent');
  const [includeFrame, setIncludeFrame] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const previewRef = useRef(null);
  const { takeScreenshot } = useScreenshot(previewRef, {
    onCaptureStart: () => setCapturing(true),
    onCaptureEnd: () => setCapturing(false),
  });
  const {
    isRecording,
    isPaused,
    recordingTime,
    videoBlob,
    startRecording,
    pauseRecording,
    stopRecording,
    clearRecording,
  } = useRecorder(previewRef);

  const handleCategoryChange = useCallback((newCategory) => {
    setCategory(newCategory);
    const firstDevice = devices.find((d) => d.category === newCategory);
    if (firstDevice) setSelectedDevice(firstDevice);
  }, []);

  const handleStopRecording = useCallback(() => {
    stopRecording();
    setTimeout(() => setShowExportModal(true), 300);
  }, [stopRecording]);

  const handleExport = useCallback(
    async (blob, format, onProgress) => {
      if (format === 'webm') {
        downloadBlob(blob, 'mockframe-recording.webm');
      } else if (format === 'mp4') {
        await convertToMp4(blob, onProgress);
      } else if (format === 'gif') {
        await convertToGif(blob, onProgress);
      }
      setShowExportModal(false);
      clearRecording();
    },
    [clearRecording]
  );

  const hideToolbar = capturing;

  return (
    <div className={styles.container} style={url ? { background } : undefined}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>M</div>
          <span className={styles.logoText}>MockFrame</span>
        </div>

        <URLInput onSubmit={setUrl} currentUrl={url} />

        <DevicePicker
          category={category}
          onCategoryChange={handleCategoryChange}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
        />

        <CaptureControls
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          onPauseRecording={pauseRecording}
          onResumeRecording={startRecording}
          onStopRecording={handleStopRecording}
        />
      </aside>

      <main className={styles.main}>
        <DevicePreview
          url={url}
          device={selectedDevice}
          background={background}
          previewRef={previewRef}
          includeFrame={includeFrame}
        />
        <BackgroundPicker
          background={background}
          onBackgroundChange={setBackground}
          hidden={hideToolbar}
          onScreenshot={takeScreenshot}
          onStartRecording={startRecording}
          onPauseRecording={pauseRecording}
          onStopRecording={handleStopRecording}
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          disabled={!url}
          includeFrame={includeFrame}
          onIncludeFrameChange={setIncludeFrame}
        />
      </main>

      {showExportModal && videoBlob && (
        <ExportModal
          videoBlob={videoBlob}
          onClose={() => {
            setShowExportModal(false);
            clearRecording();
          }}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
