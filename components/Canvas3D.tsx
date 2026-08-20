'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t / 2) / 2;
    meshRef.current.rotation.y = Math.cos(t / 2) / 2;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
        <MeshWobbleMaterial
          color="#6366f1"
          factor={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function Canvas3D() {
  return (
    <div className="h-48 w-full rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-indigo-500/20 overflow-hidden relative shadow-2xl">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          3D Interactive Campus Space
        </span>
        <h3 className="text-white font-bold text-sm mt-1">หมุนดูวัตถุ 3D หรือลากโต้ตอบได้</h3>
      </div>
      
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#818cf8" intensity={2} />
        <FloatingShape />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}