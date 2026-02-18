import useMediaCapture from "./core/useMediaCapture";
import useDualRecorder from "./core/useDualRecorder";
import DualPreview from "./components/DualPlayback";

function App() {
  // Phase 1 — Capture
  const {
    cameraStream,
    screenStream,
    isCapturing,
    startCapture,
    stopCapture,
    error,
  } = useMediaCapture();

  // Phase 2 — Recording
  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useDualRecorder(cameraStream, screenStream);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dual Stream Recording Framework</h1>

      {!isCapturing ? (
        <button onClick={startCapture}>Start Capture</button>
      ) : (
        <button onClick={stopCapture}>Stop Capture</button>
      )}

      {isCapturing && !isRecording && (
        <button onClick={startRecording}>Start Recording</button>
      )}

      {isRecording && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <DualPreview
        cameraStream={cameraStream}
        screenStream={screenStream}
      />
    </div>
  );
}

export default App;
