import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX, useAnimations } from '@react-three/drei';
import Draggable from 'react-draggable';
import { SkeletonHelper } from 'three';

const visemeMap = {
  a: 0,   // Corresponding morph target index for 'a'
  e: 1,   // Corresponding morph target index for 'e'
  i: 2,   // Corresponding morph target index for 'i'
  o: 3,   // Corresponding morph target index for 'o'
  u: 4,   // Corresponding morph target index for 'u'
  b: 5,   // Corresponding morph target index for 'b'
};

// Animated model component
const AnimatedModel = ({ viseme, text }) => {
  const { scene } = useGLTF('/new.glb');
  const avatarAnimation = useFBX('/Waving.fbx');
  const talkAnimation = useFBX('/StandingArguing2.fbx');
  const walkAnimation = useFBX('/IvPoleWalking.fbx');


    // Name each animation uniquely
  avatarAnimation.animations[0].name = "waving";
  talkAnimation.animations[0].name = "talking";
  walkAnimation.animations[0].name = "walking";


  const [bones, setBones] = useState(false);
  const [data, setData] = useState("");
 
    // Combine all animations
  const allAnimations = [
    ...avatarAnimation.animations,
    ...talkAnimation.animations,
    ...walkAnimation.animations
];

  const group = useRef();
  const { actions } = useAnimations(allAnimations, group);
  const skeletonHelperRef = useRef();

  
  if(data && bones){
    // console.log(data);
  }
  
  useEffect(() => {
    // if (!bones) return; // Early return if bones are not available
  
    // Function to play and stop animations based on 'text'
    const playOrStopAnimations = () => {
      if (!actions["walking"] || !actions["waving"] || !actions["talking"]) {
        console.error('Animation actions not found');
        return;
      }
  
      if (!text) {
        // No text, play the animations
        actions["waving"].play();
      } else if (text && !actions["talking"].isRunning()) {
        actions["waving"].stop();
        actions["talking"].play();
      } else {
        // Text is present, stop animations
        actions["waving"].stop();
        actions["talking"].stop();
      }
    };
  
    // Call the function initially
    playOrStopAnimations();
  
    // Clean-up function to stop animations when component unmounts
    return () => {
      if (actions && actions["waving"]) actions["waving"].stop();
      if (actions && actions["talking"]) actions["talking"].stop();
    };
  }, [text, actions]);
  
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
  useEffect(() => {
    if (walkAnimation && walkAnimation.animations && walkAnimation.animations.length > 0) {
      var count = 0;
      walkAnimation.animations.forEach((animation) => {
        animation.tracks.forEach((track) => {
          const trackName = track.name.split('.')[0];
          console.log(`Bone used in walk animation: ${trackName}`);
          count++;
        });
      });
      console.log('walkanimation', count);
    }
    if (talkAnimation && talkAnimation.animations && talkAnimation.animations.length > 0) {
      var count = 0;
      talkAnimation.animations.forEach((animation) => {
        animation.tracks.forEach((track) => {
          const trackName = track.name.split('.')[0];
          console.log(`Bone used in talk animation: ${trackName}`);
          count++;
        });
      });
      console.log('talkanimation', count);

    }
    if (group.current && !skeletonHelperRef.current) {
      skeletonHelperRef.current = new SkeletonHelper(group.current);
      group.current.add(skeletonHelperRef.current);

      // Log bone names and hierarchy
      var count = 0;
      group.current.traverse((child) => {
        if (child.isBone) {
          console.log(`Bone: ${child.name}`);
          count++;
        }
      });
    }
  console.log(count);
    return () => {
      if (group.current && skeletonHelperRef.current) {
        group.current.remove(skeletonHelperRef.current);
        skeletonHelperRef.current = null;
      }
    };
  }, [group]);
  useEffect(() => {
    if (walkAnimation && group.current) {
      const updatedBones = new Set();
      
      walkAnimation.animations.forEach((animation) => {
        animation.tracks.forEach((track) => {
          const trackName = track.name.split('.')[0];
          
          group.current.traverse((child) => {
            if (child.isBone && !updatedBones.has(child) && !updatedBones.has(trackName)) {
              // Check if the current bone name matches the track name or if it needs to be renamed
              if (child.name === trackName || !updatedBones.has(child.name)) {
                child.name = trackName;
                // console.log(`Synchronized bone name: ${child.name}`);
                updatedBones.add(trackName);
                setData(Array.from(updatedBones));
                setBones(true);
              }
            }
          });
        });
      });

      // Print all updated bone names after synchronization
      // console.log('All synchronized bone names:', Array.from(updatedBones));
 
     
    }
  }, [walkAnimation, group]);

  useEffect(() => {
    if (bones) {
      if (group.current && !skeletonHelperRef.current) {
        skeletonHelperRef.current = new SkeletonHelper(group.current);
        group.current.add(skeletonHelperRef.current);

        // Log bone names and hierarchy after synchronization
        let count = 0;
        console.log('Bones after synchronization:');
        group.current.traverse((child) => {
          if (child.isBone) {
            console.log(`updated Bone: ${child.name}`);
            count++;
          }
        });
        console.log(count);
      }
    }
  }, [bones, group]);
 


  return (
    <group ref={group}  dispose={null}>
      <primitive object={scene} scale={1.5}   />

      {/* scale={1.13} */}
       
    </group>
  );
};

// Avatar component
const Avatar = ({ text}) => {

 console.log('text', text);
  const [currentViseme, setCurrentViseme] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;

    if (!text || synth.speaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const phonemeTimings = []; // This should come from your phoneme timings service
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

   const voices = synth.getVoices();
    const femaleVoice = voices.find(voice => voice.name === 'Google UK English Female'); // Adjust voice selection based on available voices
      
    utterance.voice = femaleVoice;
    synth.speak(utterance);
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="fixed flex items-center justify-center h-screen">

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
