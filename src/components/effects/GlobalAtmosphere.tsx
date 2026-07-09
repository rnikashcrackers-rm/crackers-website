'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { usePathname } from 'next/navigation';
import { Diya3D } from './TraditionalAssets3D';

function FloatingParticles({ count = 50 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      factor: 20 + Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      xFactor: -50 + Math.random() * 100,
      yFactor: -50 + Math.random() * 100,
      zFactor: -50 + Math.random() * 100,
    }));
  }, [count]);

  useFrame(() => {
    particles.forEach((p, i) => {
      let { t, speed, xFactor, yFactor, zFactor } = p;
      t = p.t += speed / 2;
      dummy.position.set(
        xFactor + Math.cos(t) * 10,
        yFactor + Math.sin(t) * 10,
        zFactor + Math.cos(t) * 10
      );
      const s = Math.cos(t) * 0.5 + 0.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshStandardMaterial color="#FF8A6B" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function FloatingDiyas({ count = 8 }) {
  const diyas = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        (Math.random() - 1) * 40,
      ] as [number, number, number],
      speed: 0.1 + Math.random() * 0.2,
    }));
  }, [count]);

  return (
    <group>
      {diyas.map((d, i) => (
        <Float key={i} speed={d.speed * 5} rotationIntensity={1} floatIntensity={1}>
          <Diya3D position={d.position} scale={0.4} />
        </Float>
      ))}
    </group>
  );
}

export function GlobalAtmosphere() {
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || pathname === '/') return null; // Hero already has it

  return (
    <div suppressHydrationWarning className="fixed inset-0 z-[-1] pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[20, 20, 20]} intensity={1.5} color="#FF8A6B" />
          <FloatingParticles count={80} />
          <FloatingDiyas />
        </Suspense>
      </Canvas>
    </div>
  );
}
