import React, { useState } from "react";
import { createPortal } from "react-dom";

const VoiceInput = ({ onTranscript }) => {
  const [recording, setRecording] = useState(false);

  const handleClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  // Microphone Modal (Portal)
  const modal = recording ? (
    <div className="voice-backdrop">
      <div className="voice-modal">
        <div className="mic-circle">
          🎤
        </div>
        <p>Listening...</p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className={recording ? "mic recording" : "mic"}
        onClick={handleClick}
      >
        🎙️ Speak & Create
      </button>

      {createPortal(modal, document.getElementById("parse-input"))}
    </>
  );
};

export default VoiceInput;
