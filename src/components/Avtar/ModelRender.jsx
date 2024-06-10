import React, { useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Avtar from "./Avtar";

const ModelRender = () => {
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speak, setspeakcompleted] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // const handleSpeak = () => {
  //   if (inputText.trim() !== '') {
  //     const utterance = new SpeechSynthesisUtterance(inputText);
  //     console.log()
  //     utterance.onend = () => {
  //       setIsSpeaking(false);
  //       console.log("Speech synthesis completed.");
  //       const synth = window.speechSynthesis.getVoices();
  //       console.log(synth);
  //       setspeakcompleted(true);
  //     };
  //     setIsSpeaking(true);
  //     console.log("Starting speech synthesis.");
  //     window.speechSynthesis.speak(utterance);
  //   }
  // };
  const handleSpeak = () => {
    if (inputText.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(inputText);
  
      // Set the onend event handler
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log("Speech synthesis completed.");
        // setspeakcompleted(true);
      };
  
      setIsSpeaking(true);
      console.log("Starting speech synthesis.");
  
      // Wait for the voices to be loaded before selecting one
      window.speechSynthesis.onvoiceschanged = () => {
        // Get the list of available voices
        const voices = window.speechSynthesis.getVoices();
  
        // Find the voice with the name "Google हिन्दी"
        const hindiVoice = voices.find(voice => voice.name === "Google हिन्दी");
  
        if (hindiVoice) {
          // Set the selected voice
          utterance.voice = hindiVoice;
  
          // Speak the text
          window.speechSynthesis.speak(utterance);
          setspeakcompleted(true);
        } else {
          console.error("Voice not found: Google हिन्दी");
  //     window.speechSynthesis.speak(utterance);

        }
      };
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
        <button onClick={handleSpeak} className="w-full p-2 mb-4 text-white bg-blue-500 rounded">Speak</button>
      </div>

      <div className="flex h-full md:flex-1 ">
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
            <Avtar start={isSpeaking} text={inputText} end={speak} scale={[2, 2, 2]} position={[0, -1.5, 0]} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default ModelRender;
