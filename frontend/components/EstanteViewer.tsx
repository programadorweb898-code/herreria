"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

const MODEL_PATH = "/models/base_basic_shaded.glb";

interface Props {
  width?: number;
  height?: number;
  depth?: number;
}

function EstanteModel({
  width = 1,
  height = 1,
  depth = 1,
}: Required<Props>) {
  const gltf = useGLTF(MODEL_PATH) as GLTF;
  const sourceScene: THREE.Group | null = gltf?.scene ?? null;

  const clonedScene = useMemo(() => {
    if (!sourceScene) {
      return null;
    }

    return sourceScene.clone(true);
  }, [sourceScene]);

  useEffect(() => {
    if (!clonedScene) {
      return;
    }

    clonedScene.scale.set(width, height, depth);
    clonedScene.updateMatrixWorld(true);
  }, [clonedScene, depth, height, width]);

  if (!sourceScene || !clonedScene) {
    return null;
  }

  return <primitive object={clonedScene} />;
}

function ViewerFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm uppercase tracking-[0.18em] text-white/60">
      Cargando visor 3D
    </div>
  );
}

export default function EstanteViewer({
  width = 1,
  height = 1,
  depth = 1,
}: Props) {
  return (
    <div className="h-[500px] w-full overflow-hidden bg-zinc-900">
      <Suspense fallback={<ViewerFallback />}>
        <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <EstanteModel width={width} height={height} depth={depth} />
          <OrbitControls enableDamping />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(MODEL_PATH);
