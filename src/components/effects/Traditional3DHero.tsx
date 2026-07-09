'use client';

import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars, Cloud, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Diya3D, Rocket3D, FlowerPot3D, TraditionalPerson, Chakkar3D, PaperBomb3D, Thoranam3D, Sweets3D, TraditionalClothes3D } from './TraditionalAssets3D';

function HangingDeepam3D({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  return (
    <group ref={ref} position={position}>
      {/* Chain */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 5, 8]} />
        <meshStandardMaterial color="#A67C00" metalness={1} roughness={0.2} />
      </mesh>
      <Diya3D position={[0, 0, 0]} scale={0.7} />
    </group>
  );
}

function GoldenEmbers({ count = 200 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.005 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -20 + Math.random() * 60;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const s = 0.5 + Math.cos(t) * 0.5;
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor),
        yFactor + Math.sin((t / 10) * factor),
        zFactor + Math.cos((t / 10) * factor)
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshStandardMaterial color="#FF8A6B" emissive="#FF8A6B" emissiveIntensity={4} transparent opacity={0.6} />
    </instancedMesh>
  );
}

function SceneContent() {
  const { mouse } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle parallax based on mouse
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 20, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (-mouse.y * Math.PI) / 30, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* ─── Ground Components ─── */}
      <group position={[0, -7, 0]}>
        {/* Floor geometry for receiving shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>
        
        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000" />

        {/* Traditional Sweets & Clothes */}
        <Sweets3D position={[5, 0.2, 8]} />
        <TraditionalClothes3D position={[-5, 0.6, 8]} />

        {/* Traditional Tamil People Billboards */}
        <TraditionalPerson url="/man-vesti.png" position={[-2.5, 2.5, 8]} scale={5} />
        <TraditionalPerson url="/woman-saree.png" position={[2.5, 2.5, 8]} scale={5} />

        {/* Crackers on the floor */}
        <Chakkar3D position={[-8, 0.1, 12]} />
        <Chakkar3D position={[8, 0.1, 12]} />
        
        <FlowerPot3D position={[-12, 1, 5]} />
        <FlowerPot3D position={[12, 1, 5]} />
        
        <PaperBomb3D position={[-4, 0.5, 15]} />
        <PaperBomb3D position={[4, 0.5, 15]} />
        <PaperBomb3D position={[0, 0.5, 18]} />
        
        {/* Rockets lined up at the back */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Rocket3D key={i} position={[(i - 3.5) * 5, 1.2, -5]} active={true} />
        ))}
      </group>

      {/* ─── Hanging & Floating Components ─── */}
      <Thoranam3D position={[0, 12, -8]} />
      
      <HangingDeepam3D position={[-14, 6, 2]} />
      <HangingDeepam3D position={[14, 6, 2]} />
      <HangingDeepam3D position={[-8, 8, -5]} />
      <HangingDeepam3D position={[8, 8, -5]} />

      {/* Floating Diya Atmosphere */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
          <Diya3D 
            position={[
              (Math.random() - 0.5) * 40, 
              5 + Math.random() * 10, 
              (Math.random() - 0.5) * 20 - 10
            ]} 
            scale={0.4} 
          />
        </Float>
      ))}

      <GoldenEmbers count={150} />
    </group>
  );
}

export function Traditional3DHero() {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
    
    // Set up vanilla intersection observer to unmount WebGL offscreen
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { 
      rootMargin: '100px', // start loading slightly before coming into view
      threshold: 0.01 
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!hasMounted) return <div className="absolute inset-0 z-0 bg-[#0A0A08]" />;

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      {inView ? (
        <Canvas shadows dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={45} />
            
            <ambientLight intensity={0.5} />
            {/* Main Key Light */}
            <spotLight 
              position={[10, 20, 10]} 
              angle={0.3} 
              penumbra={1} 
              intensity={2} 
              castShadow 
              shadow-mapSize={[1024, 1024]}
              color="#FFB199"
            />
            {/* Accent Warm Lights */}
            <pointLight position={[-15, 10, 5]} intensity={1.5} color="#FF6600" />
            <pointLight position={[15, 5, 10]} intensity={1} color="#FF8A6B" />
            
            <SceneContent />
            
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1.5} />
            <Cloud position={[-15, 15, -20]} speed={0.3} opacity={0.2} color="#1a1a1a" />
            <Cloud position={[15, 18, -25]} speed={0.3} opacity={0.2} color="#1a1a1a" />
            
            <Environment preset="night" />
            
            <fog attach="fog" args={['#0A0A08', 15, 55]} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-[#0A0A08]" />
      )}
      
      {/* Cinematic Vignette & Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-black/20 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] via-transparent to-transparent opacity-80 pointer-events-none" />
    </div>
  );
}

