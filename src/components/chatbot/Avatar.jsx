import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';


// Animated model component
const AnimatedModel = ({ start }) => {
  const animatedGLB = "/model.glb"; // Path to animated GLB file

  const group = useRef();
  const { scene, animations, nodes, materials } = useGLTF(animatedGLB);
  const { actions } = useAnimations(animations, group);
  console.log(nodes);

  if (start && actions && actions["Armature.001|mixamo.com|Layer0"]) {
    actions["Armature.001|mixamo.com|Layer0"].play();
    console.log('Animation started');
  }

  return (
    <group ref={group}  dispose={null}>
      <primitive object={scene} scale={1.5}   />
      {/* scale={1.13} */}
       
     {/*  */}
    </group>
  );
};

// Avatar component
const Avatar = ({ start }) => {

  return (
    <div className="flex items-center justify-center h-screen">
      <Canvas  camera={{ position: [7, 8, 18.25], fov: 18 }}>
        <ambientLight intensity={2.0} />
        <directionalLight intensity={0.4} />
        <spotLight position={[10, 75, 10]} angle={1.15} penumbra={2} />
        <pointLight position={[0, -3, 10]} intensity={2}/>
        <Suspense fallback={null}>
          <AnimatedModel start={start}  />
        </Suspense>
        <OrbitControls /> 
      </Canvas>
    </div>
  );
};

export default Avatar;
