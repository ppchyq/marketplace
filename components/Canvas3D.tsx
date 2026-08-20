'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls, RoundedBox } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface Canvas3DProps {
  category?: string;
}

function Product3DModel({ category }: { category?: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
  });

  // สร้างรูปทรง 3D แตกต่างกันตามประเภทสินค้า
  if (category === 'หนังสือเรียน' || category === 'ไอที/เครื่องใช้ไฟฟ้า') {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1.6, 2.2, 0.3]} />
          <MeshWobbleMaterial color="#818cf8" factor={0.1} speed={1} roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>
    );
  }

  if (category === 'เสื้อผ้า/ยูนิฟอร์ม') {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.8, 1.2, 1.8, 32]} />
          <MeshWobbleMaterial color="#34d399" factor={0.2} speed={1.5} roughness={0.5} />
        </mesh>
      </Float>
    );
  }

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.7, 0.25, 128, 32]} />
        <MeshWobbleMaterial color="#6366f1" factor={0.3} speed={2} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

export default function Canvas3D({ category }: Canvas3DProps) {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#818cf8" intensity={2} />
        <Product3DModel category={category} />
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}