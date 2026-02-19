import useMediaCapture from "./core/useMediaCapture";
import useDualRecorder from "./core/useDualRecorder";
import DualPreview from "./components/DualPlayback";
import "./App.css";

function App() {
  const {
    cameraStream,
    screenStream,
    isCapturing,
    startCapture,
    stopCapture,
    error,
  } = useMediaCapture();

  const { isRecording, startRecording, stopRecording } = useDualRecorder(
    cameraStream,
    screenStream
  );

  const captureButton = !isCapturing
    ? {
        label: "Start Capture",
        action: startCapture,
        className: "btn btn-primary",
      }
    : {
        label: "Stop Capture",
        action: stopCapture,
        className: "btn btn-danger",
      };

  return (
    <div className="app-shell">
      <main className="app-panel">
        <header className="app-header">
          <p className="eyebrow">Dual Stream Tool</p>
          <h1>Record Camera + Screen</h1>
          <p className="subtitle">
            Start capture first, then record both feeds in parallel.
          </p>
        </header>

        <section className="status-row" aria-label="Current status">
          <div className={`status-card ${isCapturing ? "on" : "off"}`}>
            <span>Capture</span>
            <strong>{isCapturing ? "Active" : "Idle"}</strong>
          </div>
          <div className={`status-card ${isRecording ? "recording" : "off"}`}>
            <span>Recording</span>
            <strong>{isRecording ? "Running" : "Stopped"}</strong>
          </div>
        </section>

        <section className="controls" aria-label="Capture controls">
          <button className={captureButton.className} onClick={captureButton.action}>
            {captureButton.label}
          </button>

          {isCapturing && !isRecording && (
            <button className="btn btn-secondary" onClick={startRecording}>
              Start Recording
            </button>
          )}

          {isRecording && (
            <button className="btn btn-danger" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
        </section>

        <p className="help-text">
          Tip: Click the smaller preview window to swap camera and screen.
        </p>

        {error && (
          <p className="error-banner" role="alert">
            {error}
          </p>
        )}

        <DualPreview cameraStream={cameraStream} screenStream={screenStream} />
      </main>
    </div>
  );
}

export default App;
