// src/App.js
import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';


// Define viseme mapping
// const visemeMap = {
//   a: 0, // Corresponding morph target index for 'a'
//   e: 1, // Corresponding morph target index for 'e'
//   i: 2, // Corresponding morph target index for 'i'
//   o: 3, // Corresponding morph target index for 'o'
//   u: 4, // Corresponding morph target index for 'u'
//   b: 5, // Corresponding morph target index for 'b'
//   // Add more mappings as needed
// };
const visemeMap = {
  a: 0,   // Corresponding morph target index for 'a'
  e: 1,   // Corresponding morph target index for 'e'
  i: 2,   // Corresponding morph target index for 'i'
  o: 3,   // Corresponding morph target index for 'o'
  u: 4,   // Corresponding morph target index for 'u'
  b: 5,   // Corresponding morph target index for 'b'
  A: 6,   // Corresponding morph target index for 'A'
  E: 7,   // Corresponding morph target index for 'E'
  O: 8,   // Corresponding morph target index for 'O'
  ';': 9, // Corresponding morph target index for ';'
  S: 10,  // Corresponding morph target index for 'S'
  c: 11,  // Corresponding morph target index for 'c'
  z: 12,  // Corresponding morph target index for 'z'
  h: 13,  // Corresponding morph target index for 'h'
  j: 14,  // Corresponding morph target index for 'j'
  er: 15, // Corresponding morph target index for 'er'
  t: 16,  // Corresponding morph target index for 't'
  d: 17,  // Corresponding morph target index for 'd'
  y: 18,  // Corresponding morph target index for 'y'
  ix: 19, // Corresponding morph target index for 'ix'
  I: 20,  // Corresponding morph target index for 'I'
  f: 21,  // Corresponding morph target index for 'f'
  v: 22,  // Corresponding morph target index for 'v'
  w: 23,  // Corresponding morph target index for 'w'
  U: 24,  // Corresponding morph target index for 'U'
  T: 25,  // Corresponding morph target index for 'T'
  D: 26,  // Corresponding morph target index for 'D'
  ow: 27, // Corresponding morph target index for 'ow'
  o: 28,  // Corresponding morph target index for 'o'
  k: 29,  // Corresponding morph target index for 'k'
  g: 30,  // Corresponding morph target index for 'g'
  aw: 31, // Corresponding morph target index for 'aw'
  n: 32,  // Corresponding morph target index for 'n'
  oy: 33, // Corresponding morph target index for 'oy'
  p: 34,  // Corresponding morph target index for 'p'
  m: 35,  // Corresponding morph target index for 'm'
};


// Load and render the GLB model
const Model = ({ viseme}) => {
  const { scene } = useGLTF('/indModel.glb');
  
  const groupRef = useRef();


  useEffect(() => {
    if (groupRef.current) {
      let mesh;
      groupRef.current.traverse((child) => {
        if (child.isMesh) {
          mesh = child;
        }
      });

      if (mesh) {
        for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
          mesh.morphTargetInfluences[i] = 0;
        }

        if (mesh.morphTargetInfluences[viseme] !== undefined) {
          mesh.morphTargetInfluences[viseme] = 1;
        }
      }


    }
  }, [viseme]);

  return <primitive ref={groupRef} object={scene} />;
};


const LipSync = ({ text }) => {
  const [currentViseme, setCurrentViseme] = useState(null);

  useEffect(() => {
    if (!text) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const phonemeTimings = []; // This should come from your phoneme timings service

    // Placeholder function to simulate phoneme timings for demonstration
    // You will need to replace this with actual phoneme timings logic
    const simulatePhonemeTimings = () => {
      const phonemes = text.split('');
      phonemes.forEach((phoneme, index) => {
        phonemeTimings.push({
          viseme: visemeMap[phoneme.toLowerCase()] || 0,
          time: index * 200 // Simulating 200ms per phoneme
        });
      });
    };
    console.log(phonemeTimings);

    simulatePhonemeTimings();

    let i = 0;
    const interval = setInterval(() => {
      if (i < phonemeTimings.length) {
        setCurrentViseme(phonemeTimings[i].viseme);
        i++;
      } else {
        clearInterval(interval);
        setCurrentViseme(null); // Reset viseme when animation ends
      }
    }, 200); // Adjust interval duration as needed

    utterance.onend = () => {
      clearInterval(interval);
      setCurrentViseme(null); // Reset viseme when speech ends
    };

    synth.speak(utterance);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className='h-screen pt-8 bg-black'>
      <Canvas camera={{ position: [1, 4.5, 7], fov: 35, castShadow: true }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[1, 10, 10]} />
        <OrbitControls />
        <Model viseme={currentViseme}   position={[2, -1.5, 5]}/>
      </Canvas>
    </div>
  );
};

function MessageParser() {
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const handleSubmit = () => {
    setSubmittedText(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
    <div className='h-screen md:flex'>
    <div className="flex items-center justify-center bg-gray-200 md:flex-1">
        <div className="w-full max-w-md mx-auto">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            style={{ fontSize: '16px' }}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          />
          <button onClick={handleSubmit} className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
      <div className="md:flex-1">

      <LipSync text={submittedText} />
      </div>
      </div>
    </>
  );
}

export default MessageParser;
