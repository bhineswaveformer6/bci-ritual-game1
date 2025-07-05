
'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BrainMetrics } from '@/lib/bci-simulation';
import { cn } from '@/lib/utils';

interface AnimatedModelProps {
  url?: string;
  brainMetrics: BrainMetrics;
  modelType?: 'cube' | 'sphere' | 'torus' | 'octahedron' | 'icosahedron';
}

function AnimatedModel({ url, brainMetrics, modelType = 'sphere' }: AnimatedModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const { energeticSignature, focusScore, calmScore, coherence } = brainMetrics;
    
    // Rotation based on focus score
    meshRef.current.rotation.y += (focusScore / 1000) * delta;
    meshRef.current.rotation.x += (calmScore / 2000) * delta;
    
    // Scale based on energetic signature
    const scale = 0.8 + (energeticSignature / 500);
    meshRef.current.scale.setScalar(scale);
    
    // Color transitions based on brain state
    const hue = (energeticSignature / 100) * 0.7; // 0 to 0.7 (red to blue)
    const saturation = 0.8 + (coherence * 0.2);
    const lightness = 0.4 + (energeticSignature / 200);
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.color.setHSL(hue, saturation, lightness);
    
    // Emissive glow based on coherence
    const emissiveIntensity = coherence * 0.3;
    material.emissive.setHSL(hue, saturation * 0.5, emissiveIntensity);
    
    // Metalness varies with meditation depth
    material.metalness = 0.2 + (brainMetrics.meditationDepth / 500);
  });

  // Render different geometries based on modelType
  switch (modelType) {
    case 'cube':
      return (
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#00ffff"
            metalness={0.5}
            roughness={0.2}
            emissive="#001122"
          />
        </mesh>
      );
    case 'torus':
      return (
        <mesh ref={meshRef}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshStandardMaterial
            color="#00ffff"
            metalness={0.5}
            roughness={0.2}
            emissive="#001122"
          />
        </mesh>
      );
    case 'octahedron':
      return (
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#00ffff"
            metalness={0.5}
            roughness={0.2}
            emissive="#001122"
          />
        </mesh>
      );
    case 'icosahedron':
      return (
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#00ffff"
            metalness={0.5}
            roughness={0.2}
            emissive="#001122"
          />
        </mesh>
      );
    case 'sphere':
    default:
      return (
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            metalness={0.5}
            roughness={0.2}
            emissive="#001122"
          />
        </mesh>
      );
  }
}

function ParticleField({ brainMetrics }: { brainMetrics: BrainMetrics }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const { energeticSignature } = brainMetrics;
    
    // Rotate particle field
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    
    // Scale based on energetic signature
    const scale = 0.5 + (energeticSignature / 200);
    groupRef.current.scale.setScalar(scale);
  });

  // Create a simple particle field using small spheres
  const particles = React.useMemo(() => {
    const particleArray = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 8;
      particleArray.push({ x, y, z, key: i });
    }
    return particleArray;
  }, []);

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh key={particle.key} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-cyan-400 animate-pulse">Loading 3D Model...</div>
    </div>
  );
}

interface ModelViewerProps {
  brainMetrics: BrainMetrics;
  modelUrl?: string;
  modelType?: 'cube' | 'sphere' | 'torus' | 'octahedron' | 'icosahedron';
  className?: string;
}

export function ModelViewer({ 
  brainMetrics, 
  modelUrl, 
  modelType = 'sphere',
  className 
}: ModelViewerProps) {
  return (
    <div className={cn('w-full h-full bg-gray-950 rounded-lg overflow-hidden', className)}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          
          {/* 3D Model */}
          <AnimatedModel 
            url={modelUrl}
            brainMetrics={brainMetrics}
            modelType={modelType}
          />
          
          {/* Particle field */}
          <ParticleField brainMetrics={brainMetrics} />
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            maxDistance={10}
            minDistance={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
