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

  return (
    <div className="preview-container">
      {/* MAIN LARGE */}
      <div className="large">
        <video ref={mainRef} autoPlay playsInline muted />
      </div>

      {/* PIP SMALL */}
      <div className="pip" onClick={handleSwap}>
        <video ref={secondaryRef} autoPlay playsInline muted />
      </div>
    </div>
  );
}
