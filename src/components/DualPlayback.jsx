import { useEffect, useRef, useState } from "react";
import "../styles/layout.css";

const isMediaStream = (source) =>
  typeof MediaStream !== "undefined" && source instanceof MediaStream;

const applySource = (videoElement, source) => {
  if (!videoElement) return;

  if (!source) {
    if (videoElement.srcObject) {
      videoElement.srcObject = null;
    }

    if (videoElement.hasAttribute("src")) {
      videoElement.removeAttribute("src");
      videoElement.load();
    }

    return;
  }

  if (isMediaStream(source)) {
    if (videoElement.srcObject !== source) {
      videoElement.srcObject = source;
    }

    if (videoElement.hasAttribute("src")) {
      videoElement.removeAttribute("src");
    }

    return;
  }

  if (videoElement.srcObject) {
    videoElement.srcObject = null;
  }

  if (videoElement.src !== source) {
    videoElement.src = source;
  }
};

export default function DualPreview({ cameraStream, screenStream }) {
  const mainRef = useRef(null);
  const secondaryRef = useRef(null);

  const [mainSource, setMainSource] = useState("camera");

  const mainStream =
    mainSource === "camera" ? cameraStream : screenStream;

  const secondaryStream =
    mainSource === "camera" ? screenStream : cameraStream;

  const mainIsUpload = !isMediaStream(mainStream);
  const secondaryIsUpload = !isMediaStream(secondaryStream);

  useEffect(() => {
    applySource(mainRef.current, mainStream);
  }, [mainStream]);

  useEffect(() => {
    applySource(secondaryRef.current, secondaryStream);
  }, [secondaryStream]);

  if (!mainStream || !secondaryStream) {
  return (
    <div className="preview-container">
      <p style={{ padding: "20px" }}>
        Waiting for both video sources...
      </p>
    </div>
  );
}

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
        <video
          ref={mainRef}
          autoPlay
          playsInline
          muted
          loop={mainIsUpload}
          controls={mainIsUpload}
        />
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
        <video
          ref={secondaryRef}
          autoPlay
          playsInline
          muted
          loop={secondaryIsUpload}
        />
        <span className="pip-label">Swap</span>
      </div>
    </div>
  );
}
