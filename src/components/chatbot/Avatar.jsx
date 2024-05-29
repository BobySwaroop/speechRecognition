import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';

// Animated model component
const AnimatedModel = () => {
  const animatedGLB = "./animated.glb"; // Path to animated GLB file

  const AnimatedGLBModel = () => {
    const group = useRef();
    const { scene, nodes, materials, animations } = useGLTF(animatedGLB);
    const { actions } = useAnimations(animations, group);
  
    useEffect(() => {
      if (actions && actions["Armature|mixamo.com|Layer0"]) {
        actions["Armature|mixamo.com|Layer0"].play();
      }
    }, [actions]);
  
    return (
      <group ref={group} dispose={null}>
        <primitive object={scene} scale={1.5} />
        {/* <primitive object={nodes.Hips} /> */}
        {/* <skinnedMesh */}
          {/* geometry={nodes.Wolf3D_Body.geometry} */}
          {/* material={materials.Wolf3D_Body} */}
          {/* skeleton={nodes.Wolf3D_Body.skeleton} */}
        {/* /> */}
        {/* Add other skinnedMesh components here */}
      </group>
    );
  };

  return (
    <AnimatedGLBModel />
  );
};

// Avatar component
const Avatar = () => {
  const avatarUrl = 'https://models.readyplayer.me/6656f66bd9e6c10e37f4f2e2.glb'; // Path to avatar GLB file

  const GLBAvatar = () => {
    const { scene } = useGLTF(avatarUrl);
    return <primitive object={scene} scale={1.5} />;
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Canvas>
        <ambientLight intensity={2.0} />
        <spotLight position={[10, 75, 10]} angle={1.15} penumbra={2} />
        <pointLight position={[-10, -20, 80]} />
        <Suspense fallback={null}>
          <GLBAvatar />
          <AnimatedModel />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Avatar;
