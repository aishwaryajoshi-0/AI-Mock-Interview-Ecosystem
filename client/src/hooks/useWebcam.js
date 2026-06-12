import { useCallback, useEffect, useRef, useState } from "react";

const useWebcam = () => {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError("Unable to access webcam. Please enable camera permissions.");
    }
  }, []);

  const stop = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  return { videoRef, isActive, error, start, stop };
};

export default useWebcam;
