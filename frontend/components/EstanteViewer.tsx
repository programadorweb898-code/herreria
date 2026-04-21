"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

const DEFAULT_MODEL_PATH = "/models/Estanteria.glb";

interface Props {
  width?: number;
  height?: number;
  depth?: number;
  modelPath?: string | null;
}

function EstanteModel({
  width = 1,
  height = 1,
  depth = 1,
  modelPath,
}: Props) {
  const path = modelPath || DEFAULT_MODEL_PATH;
  const gltf = useGLTF(path) as GLTF;
  const sourceScene: THREE.Group | null = gltf?.scene ?? null;

  const clonedScene = useMemo(() => {
    if (!sourceScene) return null;
    return sourceScene.clone(true);
  }, [sourceScene]);

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.scale.set(width, height, depth);
    clonedScene.updateMatrixWorld(true);
  }, [clonedScene, depth, height, width]);

  if (!sourceScene || !clonedScene) return null;

  return <primitive object={clonedScene} />;
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-900 px-6 text-center text-sm uppercase tracking-[0.18em] text-white/60">
      Cargando visor 3D...
    </div>
  );
}

export default function EstanteViewer({
  width = 1,
  height = 1,
  depth = 1,
  modelPath = null,
}: Props) {
  return (
    <div className="h-[500px] w-full overflow-hidden bg-zinc-900 shadow-inner">
      <Suspense fallback={<ViewerFallback />}>
        <Canvas 
          key={modelPath} // Forzamos el remount si el path cambia para evitar glitches
          camera={{ position: [2, 2, 2], fov: 50 }}
        >
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          <Center>
            <EstanteModel 
              width={width} 
              height={height} 
              depth={depth} 
              modelPath={modelPath} 
            />
          </Center>
          <OrbitControls 
            enableDamping 
            makeDefault 
            minDistance={1}
            maxDistance={8}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(DEFAULT_MODEL_PATH);
