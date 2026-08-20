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

  // 1. หนังสือเรียน (หนังสือ Calculus)
  if (category === 'หนังสือเรียน') {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1.4, 1.8, 0.3]} />
          <MeshWobbleMaterial color="#3b82f6" factor={0.05} speed={1} roughness={0.3} metalness={0.1} />
        </mesh>
      </Float>
    );
  }

  // 2. เสื้อผ้า/ยูนิฟอร์ม (เสื้อกาวน์, รองเท้า Nike, กระเป๋า Anello)
  if (category === 'เสื้อผ้า/ยูนิฟอร์ม') {
    return (
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.8, 1.1, 1.6, 32]} />
          <MeshWobbleMaterial color="#ec4899" factor={0.15} speed={1.5} roughness={0.4} />
        </mesh>
      </Float>
    );
  }

  // 3. ไอที/เครื่องใช้ไฟฟ้า (iPad Air 4, หูฟัง Sony, คีย์บอร์ด RGB)
  if (category === 'ไอที/เครื่องใช้ไฟฟ้า') {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={1.2}>
        <RoundedBox ref={meshRef} args={[1.8, 1.2, 0.15]} radius={0.08} smoothness={4}>
          <MeshWobbleMaterial color="#6366f1" factor={0.05} speed={1} roughness={0.1} metalness={0.8} />
        </RoundedBox>
      </Float>
    );
  }

  // 4. อุปกรณ์การเรียน (เครื่องคิดเลข Casio, โคมไฟ LED)
  if (category === 'อุปกรณ์การเรียน') {
    return (
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <boxGeometry args={[1.0, 1.6, 0.2]} />
          <MeshWobbleMaterial color="#10b981" factor={0.1} speed={1.2} roughness={0.2} metalness={0.3} />
        </mesh>
      </Float>
    );
  }

  // 5. อื่นๆ / หน้า Hero Banner (จักรยาน และสินค้าทั่วไป)
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.7, 0.25, 128, 32]} />
        <MeshWobbleMaterial color="#8b5cf6" factor={0.2} speed={2} roughness={0.2} metalness={0.7} />
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