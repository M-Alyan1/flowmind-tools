import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const GlassBlob = ({ position, scale, color, speed }: { position: [number, number, number], scale: number, color: string, speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * (speed * 0.8);
      
      // Subtle parallax based on pointer
      meshRef.current.position.x = position[0] + (state.pointer.x * 0.5);
      meshRef.current.position.y = position[1] + (state.pointer.y * 0.5);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={1.5} 
          roughness={0.2} 
          transmission={0.9} 
          ior={1.2} 
          chromaticAberration={0.03} 
          anisotropy={0.1}
          color={color}
        />
      </mesh>
    </Float>
  );
};

export const Scene3D = () => {
  const isReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (isReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Background glow layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-blue/30 dark:bg-accent-blue/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-purple/30 dark:bg-accent-purple/20 blur-[120px] rounded-full mix-blend-normal dark:mix-blend-screen" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <GlassBlob position={[-4, 2, -2]} scale={2.5} color="#0A84FF" speed={0.2} />
        <GlassBlob position={[4, -2, -4]} scale={3} color="#7C5CFF" speed={0.15} />
        <GlassBlob position={[0, -4, -6]} scale={2} color="#22C55E" speed={0.25} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
