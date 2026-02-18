import { useRef, useState } from "react";

export default function useDualRecorder(cameraStream, screenStream) {
  const cameraRecorderRef = useRef(null);
  const screenRecorderRef = useRef(null);

  const cameraChunks = useRef([]);
  const screenChunks = useRef([]);

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (!cameraStream || !screenStream) return;

    cameraChunks.current = [];
    screenChunks.current = [];

    const cameraRecorder = new MediaRecorder(cameraStream);
    const screenRecorder = new MediaRecorder(screenStream);

    cameraRecorderRef.current = cameraRecorder;
    screenRecorderRef.current = screenRecorder;

    cameraRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        cameraChunks.current.push(event.data);
      }
    };

    screenRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        screenChunks.current.push(event.data);
      }
    };

    cameraRecorder.onstop = () => {
      const cameraBlob = new Blob(cameraChunks.current, {
        type: "video/webm",
      });
      downloadFile(cameraBlob, "camera-recording.webm");
    };

    screenRecorder.onstop = () => {
      const screenBlob = new Blob(screenChunks.current, {
        type: "video/webm",
      });
      downloadFile(screenBlob, "screen-recording.webm");
    };

    cameraRecorder.start();
    screenRecorder.start();

    setIsRecording(true);
  };

  const stopRecording = () => {
    cameraRecorderRef.current?.stop();
    screenRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
