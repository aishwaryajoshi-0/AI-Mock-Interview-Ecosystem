import { useEffect, useMemo, useState } from "react";

const useTimer = (initialSeconds = 300, onComplete) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && seconds > 0) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
    if (seconds === 0) {
      setIsActive(false);
      onComplete?.();
    }
    return () => window.clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = (value = initialSeconds) => {
    setSeconds(value);
    setIsActive(false);
  };

  const formatted = useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [seconds]);

  const status = useMemo(() => {
    if (seconds <= 20) return "danger";
    if (seconds <= 60) return "warning";
    return "normal";
  }, [seconds]);

  return { seconds, formatted, status, isActive, start, pause, reset };
};

export default useTimer;
