'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function useRecorder(previewRef) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const displayStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const stopCropLoop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    // Resume from pause
    if (isPaused && mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      return;
    }

    try {
      // Capture the entire browser tab
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser', frameRate: 30 },
        preferCurrentTab: true,
      });
      displayStreamRef.current = displayStream;

      // Create a hidden video element to read the display stream frames
      const srcVideo = document.createElement('video');
      srcVideo.srcObject = displayStream;
      srcVideo.muted = true;
      await srcVideo.play();

      // Create an offscreen canvas for cropping to the device area
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Crop loop: every frame, read the device bounding rect and draw only that region
      function cropFrame() {
        if (!previewRef?.current || !displayStreamRef.current) return;

        const rect = previewRef.current.getBoundingClientRect();

        // The display stream captures at the screen's native resolution
        const srcW = srcVideo.videoWidth;
        const srcH = srcVideo.videoHeight;
        // Figure out the ratio between screen capture resolution and CSS viewport
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const ratioX = srcW / viewportW;
        const ratioY = srcH / viewportH;

        const cropX = Math.round(rect.left * ratioX);
        const cropY = Math.round(rect.top * ratioY);
        const cropW = Math.round(rect.width * ratioX);
        const cropH = Math.round(rect.height * ratioY);

        // Size the output canvas to the cropped region
        if (canvas.width !== cropW || canvas.height !== cropH) {
          canvas.width = cropW;
          canvas.height = cropH;
        }

        ctx.drawImage(srcVideo, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        animFrameRef.current = requestAnimationFrame(cropFrame);
      }

      cropFrame();

      // Record from the cropped canvas stream
      const croppedStream = canvas.captureStream(30);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(croppedStream, { mimeType });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        chunksRef.current = [];
        stopCropLoop();
        if (displayStreamRef.current) {
          displayStreamRef.current.getTracks().forEach((t) => t.stop());
          displayStreamRef.current = null;
        }
      };

      // If user stops sharing via browser UI
      displayStream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setVideoBlob(null);
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        console.error('Recording failed:', err);
      }
    }
  }, [isPaused, previewRef, stopCropLoop]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording]);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCropLoop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (displayStreamRef.current) {
        displayStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stopCropLoop]);

  const clearRecording = useCallback(() => {
    setVideoBlob(null);
  }, []);

  return {
    isRecording,
    isPaused,
    recordingTime,
    videoBlob,
    startRecording,
    pauseRecording,
    stopRecording,
    clearRecording,
  };
}
