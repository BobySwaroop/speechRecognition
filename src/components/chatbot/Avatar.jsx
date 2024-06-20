import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX, useAnimations } from '@react-three/drei';
import Draggable from 'react-draggable';

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

// Animated model component
const AnimatedModel = ({ viseme, text }) => {
  const { scene } = useGLTF('/indModel.glb');
  const avatarAnimation = useFBX('/Waving.fbx');

  const group = useRef();
  const { actions } = useAnimations(avatarAnimation.animations, group);

  useEffect(() => {
    // Check and play the animation
    const playAnimation = async () => {
      if(text){
        console.log('text received');

      }
      else if (!text){
        console.log('text is not recevied!');
      }
      const action = actions[avatarAnimation.animations[0].name];
      if (action && !text) {
        action.play();
        console.log('Playing animation:', avatarAnimation.animations[0].name);
      } else {
        console.error('Animation action not found:', avatarAnimation.animations[0].name);
      }
    };

    playAnimation();
  }, [actions, avatarAnimation.animations]);



  useEffect(() => {
    if (group.current) {
      let mesh;
      group.current.traverse((child) => {
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


  return (
    <group ref={group}  dispose={null}>
      <primitive object={scene} scale={1.5}   />
      {/* scale={1.13} */}
       
     {/*  */}
    </group>
  );
};

// Avatar component
const Avatar = ({ text}) => {

  console.log(text);
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
    <div className="flex items-center justify-center h-screen fixed">
      <Draggable defaultPosition={{x:-220, y:-150}} >
      <Canvas  camera={{
                position: [0, window.innerWidth / window.innerHeight, 5]
            }}
        > 
        <ambientLight intensity={2.0} />
        <directionalLight intensity={0.4} />
        {/* <spotLight position={[10, 75, 10]} angle={1.15} penumbra={2} /> */}
        <pointLight position={[0, -3, 10]} intensity={2}/>
        <Suspense fallback={null}>
          <AnimatedModel  viseme={currentViseme} text={text}  />
        </Suspense>
        {/* <OrbitControls />  */}
      </Canvas>
      </Draggable>
    </div>
  );
};

export default Avatar;
