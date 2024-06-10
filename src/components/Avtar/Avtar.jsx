import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";

const Avtar = ({ text, start, end, scale, position }) => {
  const { scene, nodes } = useGLTF("/modelavtar.glb");
  const group = useRef();
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    if (end) {
      console.log('animation stopped!');
      const headMesh = nodes.Wolf3D_Avatar;
      headMesh.morphTargetInfluences.fill(0);
      
  
    }
  }, [end, nodes]);
  

  useEffect(() => {
    const visemeMapping = {
      "viseme_PP": 2,
      "viseme_FF": 3,
      "viseme_TH": 4,
      "viseme_DD": 5,
      "viseme_kk": 6,
      "viseme_CH": 7,
      "viseme_SS": 8,
      "viseme_nn": 9,
      "viseme_RR": 10,
      "viseme_aa": 11,
      "viseme_E": 12,
      "viseme_I": 13,
      "viseme_O": 14,
      "viseme_U": 15,
      "viseme_sil": 1,
      "eyeBlinkLeft": 67,
      "eyeBlinkRight": 68,
      // Add other eye expressions if needed
    };

    const phonemeToViseme = {
      "p": "viseme_PP",
      "f": "viseme_FF",
      "th": "viseme_TH",
      "d": "viseme_DD",
      "k": "viseme_kk",
      "ch": "viseme_CH",
      "s": "viseme_SS",
      "n": "viseme_nn",
      "r": "viseme_RR",
      "a": "viseme_aa",
      "e": "viseme_E",
      "i": "viseme_I",
      "o": "viseme_O",
      "u": "viseme_U",
      "sil": "viseme_sil"
    };

    const headMesh = nodes.Wolf3D_Avatar;
    if (!headMesh || !headMesh.morphTargetInfluences) {
      console.error("Head mesh or morphTargetInfluences not found");
      return;
    }

    const setViseme = (viseme) => {
      for (let key in visemeMapping) {
        headMesh.morphTargetInfluences[visemeMapping[key]] = key === viseme ? 1 : 0;
      }
    };

    const blinkEyes = async () => {
      headMesh.morphTargetInfluences[visemeMapping["eyeBlinkLeft"]] = 1;
      headMesh.morphTargetInfluences[visemeMapping["eyeBlinkRight"]] = 1;
      await new Promise((resolve) => setTimeout(resolve, 200)); // Duration of the blink
      headMesh.morphTargetInfluences[visemeMapping["eyeBlinkLeft"]] = 0;
      headMesh.morphTargetInfluences[visemeMapping["eyeBlinkRight"]] = 0;
    };

    const getPhonemes = (text) => {
      const phonemes = text.split('').map(char => {
        if (char.trim()) {
          return phonemeToViseme[char.toLowerCase()];
        } else {
          return "viseme_sil";
        }
      });

      return phonemes;
    };

    const animateVisemes = async (phonemes) => {
      for (let phoneme of phonemes) {
        if (!start) break;
        setViseme(phoneme);

        // Randomly trigger an eye blink
        if (Math.random() < 0.1) {  // Adjust the probability as needed
          await blinkEyes();
        }

        await new Promise((resolve) => setTimeout(resolve, 200)); // Adjust the timing as needed
      }
      setViseme("viseme_sil");
    };

    if (start && text) {
      const phonemes = getPhonemes(text);
      animateVisemes(phonemes).then(() => {
        if (end) {
          headMesh.morphTargetInfluences.fill(0);
          setIsAnimating(false);
      setViseme("viseme_sil");

          console.log('animation completed!');
        }
      });
    } else {
      headMesh.morphTargetInfluences.fill(0);
    }
    
  }, [start, text, end, nodes]);

  useEffect(() => {
    if (end) {
      const headMesh = nodes.Wolf3D_Avatar;
      headMesh.morphTargetInfluences.fill(0);
      setIsAnimating(false);
    }
  }, [end, nodes]);

  return (
    <group ref={group} dispose={null} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
};

export default Avtar;
