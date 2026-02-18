import { useRef, useEffect, useState } from "react";
import "../styles/player.css";

export default function DualPlayback() {
  const masterRef = useRef(null);
  const slaveRef = useRef(null);

  const [cameraFile, setCameraFile] = useState(null);
  const [screenFile, setScreenFile] = useState(null);
  const [isSwapped, setIsSwapped] = useState(false);

  // Sync slave to master
  useEffect(() => {
    const master = masterRef.current;
    const slave = slaveRef.current;

    if (!master || !slave) return;

    const sync = () => {
      const drift = Math.abs(master.currentTime - slave.currentTime);
      if (drift > 0.3) {
        slave.currentTime = master.currentTime;
      }
    };

    master.addEventListener("timeupdate", sync);
    master.addEventListener("play", () => slave.play());
    master.addEventListener("pause", () => slave.pause());

    return () => {
      master.removeEventListener("timeupdate", sync);
    };
  }, []);

  const handleSwap = () => {
    setIsSwapped(prev => !prev);
  };

  return (
    <div className="player-wrapper">
      <h2>Dual Playback Engine</h2>

      <div className="file-inputs">
        <input type="file" accept="video/webm" onChange={(e) => setCameraFile(URL.createObjectURL(e.target.files[0]))} />
        <input type="file" accept="video/webm" onChange={(e) => setScreenFile(URL.createObjectURL(e.target.files[0]))} />
      </div>

      {cameraFile && screenFile && (
        <div className="video-stage">
          <div className={`main ${isSwapped ? "swapped" : ""}`}>
            <video
              ref={masterRef}
              src={cameraFile}
              controls
            />
          </div>

          <div className="pip" onClick={handleSwap}>
            <video
              ref={slaveRef}
              src={screenFile}
              muted
            />
          </div>
        </div>
      )}
    </div>
  );
}
