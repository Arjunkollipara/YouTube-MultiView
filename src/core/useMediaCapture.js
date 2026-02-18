import { useState } from "react";

export default function useMediaCapture() {
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  const startCapture = async () => {
    try {
      setError(null);

      // Request webcam + mic
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Request screen (video only)
      const scrStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setCameraStream(camStream);
      setScreenStream(scrStream);
      setIsCapturing(true);
    } catch (err) {
      console.error("Capture error:", err);
      setError("Permission denied or device error.");
      stopCapture();
    }
  };

  const stopCapture = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    setCameraStream(null);
    setScreenStream(null);
    setIsCapturing(false);
  };

  return {
    cameraStream,
    screenStream,
    isCapturing,
    startCapture,
    stopCapture,
    error,
  };
}
