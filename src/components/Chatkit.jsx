
import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
// import "./speech-to-text.css";

const Chatkit = () => {
  const { transcript, resetTranscript, interimTranscript, finalTranscript } = useSpeechRecognition();
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(e.target.text.value);
  };  
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
    console.log("Now listening...");
    return () => {
      SpeechRecognition.stopListening();
      console.log("Stopped Listening");
    };
  }, []);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    alert("Browser does not support speech recognition");
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea name="text" rows={10} cols={50} value={transcript}></textarea>
    

        <div className="btn-container">
          <span onClick={resetTranscript} className="btn">
            Clear Text
          </span>
          <button type="submit" className="btn">
            Print Text
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatkit;
