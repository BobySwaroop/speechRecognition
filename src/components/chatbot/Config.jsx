import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const Model = () => {
  const modelRef = useRef();
  const { scene, animations } = useGLTF('/indModel.glb'); // Path to your GLB model
  const avatarAnimation = useFBX('/Waving.fbx');

  // Log the bone structure of the GLB model
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isBone) {
        console.log(object.name);
      }
    });
  }, [scene]);

  // Combine GLTF and FBX animations
  // const combinedAnimations = [
  //   ...animations,
  //   ...avatarAnimation.animations,
  // ];

  const { actions, mixer } = useAnimations(avatarAnimation.animations, modelRef);

  useEffect(() => {
    // Log the animations to check the names
    console.log('GLTF Animations:', animations);
    console.log('FBX Animations:', avatarAnimation.animations);

    // Check and play the animation
    const playAnimation = async () => {
      const action = actions[avatarAnimation.animations[0].name];
      if (action) {
        action.play();
        console.log('Playing animation:', avatarAnimation.animations[0].name);
      } else {
        console.error('Animation action not found:', avatarAnimation.animations[0].name);
      }
    };

    playAnimation();
  }, [actions, avatarAnimation.animations]);

  return <primitive ref={modelRef} object={scene} />;
};

const Config = () => {
  return (
    <Canvas
      camera={{
        position: [5, 0, 4],
        fov: 40,
      }}
    >
      <ambientLight intensity={2.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={2} />
      <pointLight position={[-10, -10, -10]} />
      <Model />
      <OrbitControls />
    </Canvas>
  );
};

export default Config;
