"use client";

import { Suspense, memo, useCallback, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, Cylinder, Environment, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

import { getCanvasDpr, isSafariBrowser } from "@/components/three/performance";

interface BottleProps {
  position: [number, number, number];
  color: string;
}

const Bottle = memo(function Bottle({ position, color }: BottleProps) {
  const meshRef = useRef<THREE.Group>(null);

  const glassMaterial = useMemo(
    () => <meshStandardMaterial color={color} roughness={0.18} metalness={0.55} />,
    [color],
  );
  const capMaterial = useMemo(
    () => <meshStandardMaterial color="#c9a227" metalness={0.85} roughness={0.28} />,
    [],
  );

  return (
    <group position={position} ref={meshRef}>
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.35}>
        <Cylinder args={[0.03, 0.05, 0.2, 20]}>{glassMaterial}</Cylinder>
        <Cylinder args={[0.015, 0.015, 0.05, 20]} position={[0, 0.12, 0]}>
          {capMaterial}
        </Cylinder>
      </Float>
    </group>
  );
});

const InteractiveDoor = memo(function InteractiveDoor({
  position,
  rotation,
  side,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  side: "left" | "right";
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDoor = useCallback(() => {
    if (!groupRef.current) return;

    const targetRotation = isOpen ? 0 : side === "left" ? Math.PI / 2 : -Math.PI / 2;
    gsap.to(groupRef.current.rotation, {
      y: targetRotation,
      duration: 0.9,
      ease: "power2.out",
    });

    setIsOpen((prev) => !prev);
  }, [isOpen, side]);

  return (
    <group position={position}>
      <group ref={groupRef} rotation={rotation}>
        <Box
          args={[0.45, 0.9, 0.02]}
          position={[side === "left" ? 0.225 : -0.225, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            toggleDoor();
          }}
        >
          <meshStandardMaterial color="#222" roughness={0.34} metalness={0.5} />
        </Box>
        <Box args={[0.02, 0.1, 0.03]} position={[side === "left" ? 0.4 : -0.4, 0, 0.02]}>
          <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.25} />
        </Box>
      </group>
    </group>
  );
});

const ProceduralRack = memo(function ProceduralRack() {
  const [bottles, setBottles] = useState<{ id: number; pos: [number, number, number]; color: string }[]>([]);

  const addBottle = useCallback(() => {
    setBottles((prev) => [
      ...prev,
      {
        id: Date.now(),
        pos: [(Math.random() - 0.5) * 0.8, -0.2, (Math.random() - 0.5) * 0.3] as [number, number, number],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      },
    ]);
  }, []);

  return (
    <group>
      <Box args={[1, 0.05, 0.5]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#111" metalness={0.78} roughness={0.2} />
      </Box>
      <Box args={[1, 0.05, 0.5]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#111" metalness={0.78} roughness={0.2} />
      </Box>
      <Box args={[0.05, 1, 0.5]} position={[-0.475, 0, 0]}>
        <meshStandardMaterial color="#111" metalness={0.78} roughness={0.2} />
      </Box>
      <Box args={[0.05, 1, 0.5]} position={[0.475, 0, 0]}>
        <meshStandardMaterial color="#111" metalness={0.78} roughness={0.2} />
      </Box>
      <Box args={[1, 1, 0.02]} position={[0, 0, -0.24]}>
        <meshStandardMaterial color="#050505" />
      </Box>

      <InteractiveDoor position={[-0.45, 0, 0.25]} rotation={[0, 0, 0]} side="left" />
      <InteractiveDoor position={[0.45, 0, 0.25]} rotation={[0, 0, 0]} side="right" />

      {bottles.map((bottle) => (
        <Bottle key={bottle.id} position={bottle.pos} color={bottle.color} />
      ))}

      <mesh
        position={[0, 0.6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          addBottle();
        }}
      >
        <Box args={[0.2, 0.1, 0.05]}>
          <meshStandardMaterial color="#10b981" />
        </Box>
      </mesh>
    </group>
  );
});

export default function InteractiveShowcase() {
  const isSafari = isSafariBrowser();
  const dpr = getCanvasDpr();

  return (
    <div className="relative h-[600px] w-full rounded-2xl bg-neutral-950">
      <div className="absolute right-4 top-4 z-10 rounded-lg border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md">
        <h2 className="mb-1 text-xl font-bold">Rack Interactivo Pro</h2>
        <p className="text-xs text-neutral-400">Click en puertas para abrir. Click arriba para anadir botellas.</p>
      </div>

      <Canvas
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: isSafari ? "low-power" : "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [2, 2, 2], fov: 45 }}
      >
        <Suspense fallback={null}>
          {!isSafari && <Environment preset="studio" />}
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 6, 4]} intensity={1} />
          <directionalLight position={[-3, 2, -3]} intensity={0.2} />

          <ProceduralRack />
          <OrbitControls makeDefault minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
