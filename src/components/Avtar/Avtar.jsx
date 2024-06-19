import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";

const Avtar = ({ text, start, end, scale, position }) => {
  const { scene, nodes, animations } = useGLTF("/modelavtar.glb");
  const group = useRef();
  const [isAnimating, setIsAnimating] = useState(false);

  const action = useAnimations(animations, group);
  console.log(action);


    

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
      "b": "viseme_PP",
      "m": "viseme_PP",
      "f": "viseme_FF",
      "v": "viseme_FF",
      "th": "viseme_TH",
      "dh": "viseme_TH",
      "t": "viseme_DD",
      "d": "viseme_DD",
      "k": "viseme_kk",
      "g": "viseme_kk",
      "ch": "viseme_CH",
      "j": "viseme_CH",
      "s": "viseme_SS",
      "z": "viseme_SS",
      "sh": "viseme_SS",
      "zh": "viseme_SS",
      "n": "viseme_nn",
      "r": "viseme_RR",
      "l": "viseme_RR",
      "a": "viseme_aa",
      "aa": "viseme_aa",
      "e": "viseme_E",
      "ee": "viseme_E",
      "i": "viseme_I",
      "oo": "viseme_U",
      "u": "viseme_U",
      "o": "viseme_O",
      "sil": "viseme_sil"
    };

    const headMesh = nodes.Wolf3D_Avatar;
    if (!headMesh || !headMesh.morphTargetInfluences) {
      console.error("Head mesh or morphTargetInfluences not found");
      return;
    }

    console.log(nodes.Wolf3D_Avatar);
    const setViseme = (viseme) => {
        console.log(viseme);
      for (let key in visemeMapping) {
        // headMesh.morphTargetInfluences[visemeMapping[key]] = key === viseme ? 1 : 0;
        headMesh.morphTargetInfluences[visemeMapping[key]] = key === viseme ? 1 : 0;
      }
      // console.log(`Set viseme: ${viseme}`);  // Print viseme to console
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
          return phonemeToViseme[char.toLowerCase()] || "viseme_sil";
        } else {
          return "viseme_sil";
        }
      });
      return phonemes;
    };

    const animateVisemes = async (phonemes) => {

      const visemeArray = [];  // Array to store visemes
      for (let phoneme of phonemes) {
        if (!start || end) break;  // Stop if end is true
        setViseme(phoneme);
        console.log(phoneme);
        visemeArray.push(phoneme);  // Add viseme to array

        // Randomly trigger an eye blink
        if (Math.random() < 0.1) {  // Adjust the probability as needed
          await blinkEyes();
        }

        await new Promise((resolve) => setTimeout(resolve, 200)); // Adjust the timing as needed
      }
      setViseme("viseme_sil");
      console.log('animation completed!');
      console.log('Visemes:', visemeArray);  // Print viseme array to console
      if (end) {
        headMesh.morphTargetInfluences.fill(0);
        setIsAnimating(false);
        console.log('animation stopped!');
      }
    };

    if (start && text && !isAnimating) {
      console.log(text);
      setIsAnimating(true);
      const phonemes = getPhonemes(text);
      console.log(phonemes);
      animateVisemes(phonemes);
    } else {
      headMesh.morphTargetInfluences.fill(0);
    }

  }, [start, text, end, nodes]);

  useEffect(() => {
    if (end) {
      const headMesh = nodes.Wolf3D_Avatar;
      headMesh.morphTargetInfluences.fill(0);
      setIsAnimating(false);
      console.log('animation stopped!');
    }
  }, [end, nodes]);
useEffect(() => {
  nodes.Wolf3D_Avatar.morphTargetDictionary.mouthOpen = 0
},[]);
  return (
    <group ref={group} dispose={null} scale={scale} key={1} position={position}>
      <primitive object={scene} />
    </group>
  );
};

export default Avtar;
