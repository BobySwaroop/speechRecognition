import React, { useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Avtar from "./Avtar";

const ModelRender = () => {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakCompleted, setSpeakCompleted] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    
    handleVoicesChanged();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [setVoices]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSpeak = () => {
    if (inputText.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(inputText);
      console.log(utterance);

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log("Speech synthesis completed.");
        setSpeakCompleted(true);
      };

      setIsSpeaking(true);
      console.log("Starting speech synthesis.");

      const hindiVoice = voices.find(voice => voice.name === "Google हिन्दी");

      if (hindiVoice) {
        utterance.voice = hindiVoice;
        window.speechSynthesis.speak(utterance);
      } else {
        console.error("Voice not found: Google हिन्दी");
        window.speechSynthesis.speak(utterance); // Fallback to default voice
      }
    }
  };

  return (
    <div className="flex grid items-center justify-center w-full h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center h-full p-4 mb-4 rounded-lg shadow-md md:flex-col md:flex-1">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to speak"
          className="w-full p-2 mb-4 border-2 border-gray-400 rounded"
        />
        <button onClick={handleSpeak} className="w-full p-2 mb-4 text-white bg-blue-500 rounded" disabled={isSpeaking}>
          Speak
        </button>
      </div>

      <div className="flex h-full md:flex-1">
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center h-full font-bold text-[30px] font-mono text-white">
              loading...
            </div>
          }
        >
          <Canvas
            shadows="basic"
            camera={{
              position: [3, 1.5, 3],
              fov: 60,
              castShadow: true,
            }}
            className="w-full h-full"
          >
            <OrbitControls />
            <ambientLight intensity={1.5} />
            <Environment preset="sunset" />
            <directionalLight intensity={0.8} />
            <Avtar start={isSpeaking} text={inputText} end={speakCompleted} scale={[2, 2, 2]} position={[0, -1.5, 0]} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default ModelRender;


