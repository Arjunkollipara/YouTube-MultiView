import { useEffect, useRef, useState } from "react";
import useMediaCapture from "./core/useMediaCapture";
import useDualRecorder from "./core/useDualRecorder";
import DualPreview from "./components/DualPlayback";
import "./App.css";

const createEmptyUploadState = () => ({
  camera: { url: null, name: "" },
  screen: { url: null, name: "" },
});

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

  const [mode, setMode] = useState(null);
  const [uploads, setUploads] = useState(createEmptyUploadState);
  const uploadStateRef = useRef(createEmptyUploadState());

  const revokeUpload = (upload) => {
    if (upload?.url) {
      URL.revokeObjectURL(upload.url);
    }
  };

  const clearUploads = () => {
    setUploads((prev) => {
      revokeUpload(prev.camera);
      revokeUpload(prev.screen);

      const cleared = createEmptyUploadState();
      uploadStateRef.current = cleared;
      return cleared;
    });
  };

  const handleUploadChange = (target) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUpload = {
      url: URL.createObjectURL(file),
      name: file.name,
    };

    setUploads((prev) => {
      revokeUpload(prev[target]);
      const next = { ...prev, [target]: nextUpload };
      uploadStateRef.current = next;
      return next;
    });
  };

  const goToModePicker = () => {
    if (isRecording) {
      stopRecording();
    }

    if (isCapturing) {
      stopCapture();
    }

    clearUploads();
    setMode(null);
  };

  const openCaptureMode = () => {
    clearUploads();
    setMode("capture");
  };

  const openUploadMode = () => {
    if (isRecording) {
      stopRecording();
    }

    if (isCapturing) {
      stopCapture();
    }

    setMode("upload");
  };

  const stopCaptureAndRecording = () => {
    if (isRecording) {
      stopRecording();
    }

    stopCapture();
  };

  useEffect(() => {
    uploadStateRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    return () => {
      const latestUploads = uploadStateRef.current;
      revokeUpload(latestUploads.camera);
      revokeUpload(latestUploads.screen);
    };
  }, []);

  const captureButton = !isCapturing
    ? {
        label: "Start Capture",
        action: startCapture,
        className: "btn btn-primary",
      }
    : {
        label: "Stop Capture",
        action: stopCaptureAndRecording,
        className: "btn btn-danger",
      };

  const hasAnyUpload = Boolean(uploads.camera.url || uploads.screen.url);
  const uploadPreviewReady = Boolean(uploads.camera.url && uploads.screen.url);

  return (
    <div className="app-shell">
      <main className="app-panel">
        {!mode && (
          <>
            <header className="app-header">
              <p className="eyebrow">Dual Stream Tool</p>
              <h1>Choose Input Method</h1>
              <p className="subtitle">
                Start with live capture or upload existing webcam and screen
                videos.
              </p>
            </header>

            <section className="mode-grid" aria-label="Choose input method">
              <button className="mode-card" type="button" onClick={openCaptureMode}>
                <h2>Capture</h2>
                <p>Use camera and screen share, then record both in parallel.</p>
              </button>

              <button className="mode-card" type="button" onClick={openUploadMode}>
                <h2>Upload</h2>
                <p>
                  Upload existing camera and screen recordings and preview the
                  same dual layout.
                </p>
              </button>
            </section>
          </>
        )}

        {mode === "capture" && (
          <>
            <header className="app-header">
              <p className="eyebrow">Capture Mode</p>
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
              <button
                className="btn btn-neutral"
                type="button"
                onClick={goToModePicker}
                disabled={isRecording}
                title={
                  isRecording
                    ? "Stop recording before changing mode."
                    : "Go back and choose upload or capture."
                }
              >
                Change Mode
              </button>

              <button
                className={captureButton.className}
                type="button"
                onClick={captureButton.action}
              >
                {captureButton.label}
              </button>

              {isCapturing && !isRecording && (
                <button className="btn btn-secondary" type="button" onClick={startRecording}>
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button className="btn btn-danger" type="button" onClick={stopRecording}>
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
          </>
        )}

        {mode === "upload" && (
          <>
            <header className="app-header">
              <p className="eyebrow">Upload Mode</p>
              <h1>Upload Camera + Screen Videos</h1>
              <p className="subtitle">
                Upload one video for each source to preview the same dual view
                with swap support.
              </p>
            </header>

            <section className="controls" aria-label="Upload controls">
              <button className="btn btn-neutral" type="button" onClick={goToModePicker}>
                Change Mode
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={clearUploads}
                disabled={!hasAnyUpload}
              >
                Clear Uploads
              </button>
            </section>

            <section className="upload-grid" aria-label="Upload camera and screen videos">
              <label className="upload-field">
                <span>Camera Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onClick={(event) => {
                    event.currentTarget.value = "";
                  }}
                  onChange={handleUploadChange("camera")}
                />
                <small className="file-name">
                  {uploads.camera.name || "No file selected"}
                </small>
              </label>

              <label className="upload-field">
                <span>Screen Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onClick={(event) => {
                    event.currentTarget.value = "";
                  }}
                  onChange={handleUploadChange("screen")}
                />
                <small className="file-name">
                  {uploads.screen.name || "No file selected"}
                </small>
              </label>
            </section>

            <p className="help-text">
              Tip: Upload both files, then click the smaller preview to swap
              camera and screen.
            </p>

            {uploadPreviewReady ? (
              <DualPreview
                cameraStream={uploads.camera.url}
                screenStream={uploads.screen.url}
              />
            ) : (
              <p className="help-text">
                Upload both videos to preview the dual layout.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
