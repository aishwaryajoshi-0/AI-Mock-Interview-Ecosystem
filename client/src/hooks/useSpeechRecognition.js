import { useEffect, useState } from "react";

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
    } else {
      setSupported(false);
      setError("Speech recognition is not supported in this browser.");
    }
  }, []);

  const start = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Speech recognition is unavailable.");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcriptText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(transcriptText);
    };

    recognition.onerror = () => {
      setError("Speech recognition encountered an error.");
      recognition.stop();
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setError(null);
    setIsListening(true);
  };

  const stop = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.stop();
    setIsListening(false);
  };

  return { transcript, isListening, supported, error, start, stop };
};

export default useSpeechRecognition;
