"use client";

import React, { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  useGLTF,
  Float,
  Box,
  Cylinder
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// --- Tipos ---
interface BottleProps {
  position: [number, number, number];
  color: string;
}

// --- Componente de Botella (Simulado o Carga GLB) ---
const Bottle = ({ position, color }: BottleProps) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Si tuvieras un GLB de botella:
  // const { scene } = useGLTF('/models/bottle.glb');
  // const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <group position={position} ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Cylinder args={[0.03, 0.05, 0.2, 32]}>
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
        </Cylinder>
        <Cylinder args={[0.015, 0.015, 0.05, 32]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="gold" metalness={1} roughness={0.2} />
        </Cylinder>
      </Float>
    </group>
  );
};

// --- Componente Puerta con Animación GSAP ---
const InteractiveDoor = ({ position, rotation, side }: { position: [number, number, number], rotation: [number, number, number], side: 'left' | 'right' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDoor = () => {
    if (!groupRef.current) return;
    
    const targetRotation = isOpen ? 0 : (side === 'left' ? Math.PI / 2 : -Math.PI / 2);
    
    gsap.to(groupRef.current.rotation, {
      y: targetRotation,
      duration: 1.2,
      ease: "power3.inOut"
    });
    
    setIsOpen(!isOpen);
  };

  return (
    <group position={position}>
      {/* El grupo actúa como bisagra (pivote) */}
      <group ref={groupRef} rotation={rotation}>
        <Box 
          args={[0.45, 0.9, 0.02]} 
          position={[side === 'left' ? 0.225 : -0.225, 0, 0]} 
          onClick={(e) => {
            e.stopPropagation();
            toggleDoor();
          }}
        >
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.7} />
        </Box>
        {/* Manija */}
        <Box args={[0.02, 0.1, 0.03]} position={[side === 'left' ? 0.4 : -0.4, 0, 0.02]}>
          <meshStandardMaterial color="gold" />
        </Box>
      </group>
    </group>
  );
};

// --- Rack Procedural ---
const ProceduralRack = () => {
  const [bottles, setBottles] = useState<{id: number, pos: [number, number, number], color: string}[]>([]);

  const addBottle = () => {
    const newBottle = {
      id: Date.now(),
      pos: [(Math.random() - 0.5) * 0.8, -0.2, (Math.random() - 0.5) * 0.3] as [number, number, number],
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    setBottles([...bottles, newBottle]);
  };

  return (
    <group>
      {/* Estructura del Rack (Simple para el ejemplo) */}
      <Box args={[1, 0.05, 0.5]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[1, 0.05, 0.5]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[0.05, 1, 0.5]} position={[-0.475, 0, 0]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[0.05, 1, 0.5]} position={[0.475, 0, 0]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[1, 1, 0.02]} position={[0, 0, -0.24]}>
        <meshStandardMaterial color="#050505" />
      </Box>

      {/* Puertas Interactivas */}
      <InteractiveDoor position={[-0.45, 0, 0.25]} rotation={[0, 0, 0]} side="left" />
      <InteractiveDoor position={[0.45, 0, 0.25]} rotation={[0, 0, 0]} side="right" />

      {/* Botellas Dinámicas */}
      {bottles.map(b => (
        <Bottle key={b.id} position={b.pos} color={b.color} />
      ))}

      {/* Botón flotante para agregar botellas (en espacio 3D) */}
      <mesh position={[0, 0.6, 0]} onClick={(e) => { e.stopPropagation(); addBottle(); }}>
        <Box args={[0.2, 0.1, 0.05]}>
          <meshStandardMaterial color="emerald" />
        </Box>
      </mesh>
    </group>
  );
};

export default function InteractiveShowcase() {
  return (
    <div className="w-full h-[600px] bg-neutral-950 rounded-2xl relative">
      <div className="absolute top-4 right-4 z-10 text-white bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/10">
        <h2 className="text-xl font-bold mb-1">Rack Interactivo Pro</h2>
        <p className="text-xs text-neutral-400">Click en puertas para abrir. Click arriba para añadir botellas.</p>
      </div>
      
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [2, 2, 2], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[2048, 2048]} castShadow />
          
          <ProceduralRack />
          
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2.5} far={0.8} />
          <OrbitControls makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
