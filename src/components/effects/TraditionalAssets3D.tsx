'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Billboard, useTexture, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── 3D DIYA (DIVA) - UPGRADED ───
export function Diya3D({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flameRef.current) {
      const s = 1 + Math.sin(t * 12) * 0.05 + Math.random() * 0.05;
      flameRef.current.scale.set(s, s + Math.sin(t * 8) * 0.2, s);
      flameRef.current.position.y = 1.2 + Math.sin(t * 10) * 0.02;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(t * 15) * 0.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <latheGeometry args={[
          [
            new THREE.Vector2(0, 0), 
            new THREE.Vector2(0.8, 0.1), 
            new THREE.Vector2(1.2, 0.4), 
            new THREE.Vector2(1.3, 0.8), 
            new THREE.Vector2(1.1, 1),
            new THREE.Vector2(0.9, 0.9)
          ],
          64
        ]} />
        <meshStandardMaterial color="#A67C00" metalness={0.9} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#4A3B00" roughness={0.1} metalness={0.5} />
      </mesh>

      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <mesh ref={flameRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFCC33" emissive="#FF6600" emissiveIntensity={8} transparent opacity={0.9} />
        <pointLight ref={glowRef} intensity={2} distance={8} color="#FF6600" />
      </mesh>
      
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// ─── 3D ROCKET - UPGRADED ───
export function Rocket3D({ position = [0, 0, 0] as [number, number, number], active = false }) {
  const ref = useRef<THREE.Group>(null);
  const startPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state) => {
    if (active && ref.current) {
      ref.current.position.y += 0.4;
      ref.current.position.x += Math.sin(state.clock.elapsedTime * 8) * 0.05;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.02;
      if (ref.current.position.y > 40) ref.current.position.copy(startPos);
    }
  });

  return (
    <group ref={ref} position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.8, 16]} />
          <meshStandardMaterial color="#F43F5E" roughness={0.7} />
        </mesh>
        
        {/* Branding on Rocket */}
        <Text
          position={[0, 0, 0.23]}
          fontSize={0.12}
          color="#FF8A6B"
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_RW7eP5S_DWay8zzLyydVQ7mZ.woff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          NIKASH
        </Text>

        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.23, 0.02, 8, 24]} />
          <meshStandardMaterial color="#FF8A6B" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <torusGeometry args={[0.23, 0.02, 8, 24]} />
          <meshStandardMaterial color="#FF8A6B" metalness={0.8} />
        </mesh>

        <mesh position={[0, 1.2, 0]} castShadow>
          <coneGeometry args={[0.35, 0.8, 16]} />
          <meshStandardMaterial color="#FF8A6B" metalness={0.6} roughness={0.3} />
        </mesh>

        <mesh position={[0, -1, 0]} rotation={[0.2, 0, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#555" />
        </mesh>

        <mesh position={[0, -1.8, 0]}>
          <boxGeometry args={[0.04, 2.5, 0.04]} />
          <meshStandardMaterial color="#8B735B" roughness={1} />
        </mesh>
        
        {active && (
          <group position={[0, -1, 0]}>
            <Sparkles count={20} scale={0.5} size={2} speed={3} color="#FFCC33" />
            <pointLight intensity={1} distance={3} color="#FF6600" />
          </group>
        )}
      </Float>
    </group>
  );
}

// ─── SPARK FOUNTAIN ───
function SparkFountain({ count = 120, active = true }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      speed: 3 + Math.random() * 5,
      angle: Math.random() * Math.PI * 2,
      spread: 0.1 + Math.random() * 0.4,
      life: Math.random(),
      color: Math.random() > 0.2 ? "#FFCC33" : "#FFFFFF"
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!active) return;
    particles.forEach((p, i) => {
      p.life += delta * 0.6;
      if (p.life > 1) p.life = 0;
      const t = p.life;
      const r = t * p.spread * 8;
      const gravity = t * t * 2;
      dummy.position.set(Math.cos(p.angle) * r, (t * p.speed * 5) - gravity, Math.sin(p.angle) * r);
      const s = (1 - t) * 0.25;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshStandardMaterial color="#FFCC33" emissive="#FF6600" emissiveIntensity={6} transparent opacity={0.8} />
    </instancedMesh>
  );
}

// ─── 3D FLOWER POT ───
export function FlowerPot3D({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[1, 2.2, 32]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>
      
      {/* Branding on Flower Pot */}
      <Text
        position={[0, -0.4, 0.6]}
        fontSize={0.2}
        color="#FF8A6B"
        font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_RW7eP5S_DWay8zzLyydVQ7mZ.woff"
        anchorX="center"
        anchorY="middle"
      >
        JJ
      </Text>

      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 16]} />
        <meshStandardMaterial color="#333" roughness={1} />
      </mesh>
      
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.08, 16, 32]} />
        <meshStandardMaterial color="#FF8A6B" metalness={0.6} />
      </mesh>

      <group position={[0, 1.2, 0]}>
        <SparkFountain count={150} />
        <pointLight intensity={3} distance={12} color="#FFCC33" />
      </group>
    </group>
  );
}

// ─── 3D CHAKKAR ───
export function Chakkar3D({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const sparkRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.6;
    if (sparkRef.current) sparkRef.current.rotation.y -= 0.1;
  });

  return (
    <group ref={ref} position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.3, 32]} />
        <meshStandardMaterial color="#FF8A6B" metalness={0.7} roughness={0.3} />
      </mesh>
      
      <group position={[0, 0.16, 0]}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4 + i * 0.4, 0.05, 12, 48]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#F43F5E" : "#10B981"} />
          </mesh>
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      <group ref={sparkRef} position={[0, 0, 0]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]} position={[1.5, 0.1, 0]}>
            <Sparkles count={10} scale={0.5} size={3} speed={2} color="#FFCC33" />
          </group>
        ))}
      </group>
      
      <pointLight position={[0, 0.5, 0]} intensity={1.5} distance={6} color="#FFCC33" />
    </group>
  );
}

// ─── 3D PAPER BOMB ───
export function PaperBomb3D({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.2}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1, 1.8]} />
          <meshStandardMaterial color="#10B981" roughness={0.9} />
        </mesh>
        
        {/* Branding on Bomb */}
        <Text
          position={[0, 0, 0.91]}
          fontSize={0.25}
          color="#333"
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_RW7eP5S_DWay8zzLyydVQ7mZ.woff"
          anchorX="center"
          anchorY="middle"
        >
          JJ
        </Text>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.25, 0.05, 1.85]} />
          <meshStandardMaterial color="#8B735B" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.85, 0.05, 1.25]} />
          <meshStandardMaterial color="#8B735B" />
        </mesh>

        <mesh position={[0, 0.7, 0]} rotation={[0.4, 0, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </Float>
    </group>
  );
}

// ─── 3D THORANAM ───
export function Thoranam3D({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 22, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={1} />
      </mesh>
      
      {Array.from({ length: 16 }).map((_, i) => (
        <group key={i} position={[i * 1.4 - 10.5, -0.4, 0]}>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
            <mesh rotation={[0.1, 0, 0]}>
              <coneGeometry args={[0.45, 1.5, 3]} />
              <meshStandardMaterial color="#15803d" roughness={0.5} />
            </mesh>
            <mesh position={[0, -1, 0]}>
              <sphereGeometry args={[0.3, 12, 12]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.8} />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  );
}

// ─── 3D SWEETS ───
export function Sweets3D({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2, 0.15, 32]} />
        <meshStandardMaterial color="#E0E0E0" metalness={1} roughness={0.1} />
      </mesh>
      
      <group position={[0, 0.35, 0]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 6) * Math.PI * 2) * 0.9, 0, Math.sin((i / 6) * Math.PI * 2) * 0.9]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ─── BILLBOARD PEOPLE ───
export function TraditionalPerson({ url, position = [0, 0, 0] as [number, number, number], scale = 6 }: { url: string; position?: [number, number, number]; scale?: number }) {
  const texture = useTexture(url);
  return (
    <Billboard position={position} follow={true}>
      <mesh scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent opacity={1} side={THREE.DoubleSide} alphaTest={0.5} />
      </mesh>
    </Billboard>
  );
}

// ─── 3D TRADITIONAL CLOTHES ───
export function TraditionalClothes3D({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.8, 3]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      
      <group position={[-1.2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.3, 1.5]} />
          <meshStandardMaterial color="#FFF" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.6]}>
          <boxGeometry args={[1.8, 0.08, 0.3]} />
          <meshStandardMaterial color="#FF8A6B" metalness={0.8} />
        </mesh>
      </group>
      
      <group position={[1.2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.35, 1.5]} />
          <meshStandardMaterial color="#AD1457" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.82, 0.05, 0.5]} />
          <meshStandardMaterial color="#FF8A6B" metalness={1} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}


