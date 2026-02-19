import { useEffect, useRef, useState } from "react";
import "../styles/layout.css";

export default function DualPreview({ cameraStream, screenStream }) {
  const mainRef = useRef(null);
  const secondaryRef = useRef(null);

  const [mainSource, setMainSource] = useState("camera");

  const mainStream =
    mainSource === "camera" ? cameraStream : screenStream;

  const secondaryStream =
    mainSource === "camera" ? screenStream : cameraStream;

  useEffect(() => {
    if (mainRef.current && mainStream) {
      mainRef.current.srcObject = mainStream;
    }
  }, [mainStream]);

  useEffect(() => {
    if (secondaryRef.current && secondaryStream) {
      secondaryRef.current.srcObject = secondaryStream;
    }
  }, [secondaryStream]);

  if (!cameraStream || !screenStream) return null;

  const handleSwap = () => {
    setMainSource((prev) =>
      prev === "camera" ? "screen" : "camera"
    );
  };

  const handlePipKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSwap();
    }
  };

  return (
    <div className="preview-container">
      <div className="large">
        <video ref={mainRef} autoPlay playsInline muted />
        <span className="stream-badge">
          {mainSource === "camera" ? "Camera View" : "Screen View"}
        </span>
      </div>

      <div
        className="pip"
        onClick={handleSwap}
        onKeyDown={handlePipKeyDown}
        role="button"
        tabIndex={0}
        title="Swap camera and screen"
      >
        <video ref={secondaryRef} autoPlay playsInline muted />
        <span className="pip-label">Swap</span>
      </div>
    </div>
  );
}
