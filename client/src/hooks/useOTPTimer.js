import { useState, useEffect } from 'react';

/**
 * Custom hook for OTP resend timer
 * Default: 180 seconds (3 minutes)
 */
export const useOTPTimer = (initialSeconds = 180) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(initialSeconds);
    setCanResend(false);
  };

  return {
    timeLeft,
    canResend,
    formatTime,
    resetTimer,
  };
};
