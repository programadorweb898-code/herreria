"use client";

import { Suspense, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useCursor, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { disposeObjectResources, getCanvasDpr, isSafariBrowser } from "@/components/three/performance";

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

interface ProfessionalViewerProps {
  modelUrl: string;
  onMeshClick?: (meshName: string) => void;
  onMeshesLoaded?: (names: string[]) => void;
  width?: number;
  height?: number;
  depth?: number;
  woodConfig?: { color: string; roughness: number };
  onReset?: () => void;
  cameraState?: CameraState;
  onCameraChange?: (state: CameraState) => void;
}

const DynamicOrbitControls = memo(function DynamicOrbitControls({
  controlsRef,
  onCameraChange,
  objWidth,
  objHeight,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl>;
  onCameraChange: () => void;
  objWidth: number;
  objHeight: number;
}) {
  const { size, camera, invalidate } = useThree();

  const getDistanceForPercent = useCallback(
    (percent: number) => {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
      const aspect = size.width / Math.max(size.height, 1);
      const distW = (objWidth / percent) / (2 * Math.tan(fovRad / 2) * aspect);
      const distH = (objHeight / percent) / (2 * Math.tan(fovRad / 2));
      return Math.max(distW, distH);
    },
    [camera, objHeight, objWidth, size.height, size.width],
  );

  const minDistance = getDistanceForPercent(1.2);
  const maxDistance = getDistanceForPercent(0.15);
  const handleControlsChange = useCallback(() => {
    invalidate();
  }, [invalidate]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.75}
      zoomSpeed={1.05}
      onChange={handleControlsChange}
      onEnd={onCameraChange}
    />
  );
});

function createWoodTexture(baseColor: string) {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  const colorObj = new THREE.Color(baseColor);
  const darkerColor = `#${colorObj.clone().multiplyScalar(0.82).getHexString()}`;

  ctx.strokeStyle = darkerColor;
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 48; i += 1) {
    ctx.beginPath();
    ctx.globalAlpha = Math.random() * 0.22;
    let x = Math.random() * 256;
    let y = 0;
    ctx.moveTo(x, y);

    for (let j = 0; j < 8; j += 1) {
      x += (Math.random() - 0.5) * 14;
      y += 32;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 2; i += 1) {
    ctx.beginPath();
    ctx.globalAlpha = Math.random() * 0.16;
    const nx = Math.random() * 256;
    const ny = Math.random() * 256;
    ctx.ellipse(nx, ny, Math.random() * 18, Math.random() * 10, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = darkerColor;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

const Model = memo(function Model({
  url,
  onMeshClick,
  onMeshesLoaded,
  width,
  height,
  depth,
  woodConfig,
  onLoaded,
}: {
  url: string;
  onMeshClick?: (name: string) => void;
  onMeshesLoaded?: (names: string[]) => void;
  width?: number;
  height?: number;
  depth?: number;
  woodConfig?: { color: string; roughness: number };
  onLoaded?: () => void;
}) {
  const { scene: sourceScene } = useGLTF(url);
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(Boolean(hovered));

  const clonedScene = useMemo(() => {
    const nextScene = sourceScene.clone(true);
    nextScene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((material) => material.clone());
        return;
      }

      if (mesh.material) {
        mesh.material = mesh.material.clone();
      }
    });
    return nextScene;
  }, [sourceScene]);

  const meshNames = useMemo(() => {
    const names: string[] = [];
    clonedScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        names.push(node.name || "(sin nombre)");
      }
    });
    return names;
  }, [clonedScene]);

  const woodTexture = useMemo(() => {
    if (!woodConfig) return null;
    return createWoodTexture(woodConfig.color);
  }, [woodConfig]);

  useEffect(() => {
    if (onMeshesLoaded) onMeshesLoaded(meshNames);
  }, [meshNames, onMeshesLoaded]);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clonedScene.position.sub(center);
    onLoaded?.();
  }, [clonedScene, onLoaded]);

  useEffect(() => {
    if (!(width && height && depth)) return;

    clonedScene.scale.set(1, 1, 1);
    const currentBox = new THREE.Box3().setFromObject(clonedScene);
    const currentSize = new THREE.Vector3();
    currentBox.getSize(currentSize);

    clonedScene.scale.set(
      width / (currentSize.x || 1),
      height / (currentSize.y || 1),
      depth / (currentSize.z || 1),
    );

    const centeredBox = new THREE.Box3().setFromObject(clonedScene);
    const centered = new THREE.Vector3();
    centeredBox.getCenter(centered);
    clonedScene.position.sub(centered);
  }, [clonedScene, depth, height, width]);

  useEffect(() => {
    clonedScene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.map = woodTexture;
        if (woodConfig) {
          material.color = new THREE.Color(woodConfig.color);
          material.roughness = woodConfig.roughness;
        }
        material.needsUpdate = true;
      });
    });
  }, [clonedScene, woodConfig, woodTexture]);

  useEffect(() => {
    return () => {
      disposeObjectResources(clonedScene);
      woodTexture?.dispose();
    };
  }, [clonedScene, woodTexture]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onMeshClick?.((e.object as THREE.Mesh).name);
    },
    [onMeshClick],
  );

  return (
    <primitive
      object={clonedScene}
      onClick={handleClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered((e.object as THREE.Mesh).name);
      }}
      onPointerOut={() => setHovered(null)}
    />
  );
});

function ViewerLights() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#1a1a1a", 0.55]} />
      <directionalLight position={[5, 7, 4]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} />
    </>
  );
}

export default function ProfessionalViewer({
  modelUrl,
  onMeshClick,
  onMeshesLoaded,
  width,
  height,
  depth,
  woodConfig,
  onReset,
  cameraState,
  onCameraChange,
}: ProfessionalViewerProps) {
  const [contextLost, setContextLost] = useState(false);
  const [contextResetKey, setContextResetKey] = useState(0);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const canvasCleanupRef = useRef<(() => void) | null>(null);
  const isSafari = isSafariBrowser();
  const dpr = getCanvasDpr();

  useEffect(() => {
    return () => {
      canvasCleanupRef.current?.();
    };
  }, []);

  const handleModelLoaded = useCallback(() => {
    if (cameraState && controlsRef.current) {
      const { position, target } = cameraState;
      controlsRef.current.object.position.set(...position);
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [cameraState]);

  const internalReset = useCallback(() => {
    onReset?.();
  }, [onReset]);

  const handleCameraChange = useCallback(() => {
    if (!onCameraChange || !controlsRef.current) return;
    const position = controlsRef.current.object.position.toArray() as [number, number, number];
    const target = controlsRef.current.target.toArray() as [number, number, number];
    onCameraChange({ position, target });
  }, [onCameraChange]);

  const handleContextReset = useCallback(() => {
    setContextLost(false);
    setContextResetKey((prev) => prev + 1);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl touch-none">
      <Canvas
        key={`${modelUrl}-${contextResetKey}`}
        camera={{ fov: 42, position: [180, 180, 180], near: 0.1, far: 2000 }}
        dpr={dpr}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: isSafari ? "low-power" : "high-performance",
          preserveDrawingBuffer: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl, invalidate }) => {
          canvasCleanupRef.current?.();
          const canvas = gl.domElement;
          const handleLost = (event: Event) => {
            event.preventDefault();
            setContextLost(true);
          };
          const handleRestored = () => {
            setContextLost(false);
            invalidate();
          };

          canvas.addEventListener("webglcontextlost", handleLost, false);
          canvas.addEventListener("webglcontextrestored", handleRestored, false);
          canvasCleanupRef.current = () => {
            canvas.removeEventListener("webglcontextlost", handleLost, false);
            canvas.removeEventListener("webglcontextrestored", handleRestored, false);
          };
        }}
      >
        <Suspense fallback={<Loader />}>
          <ViewerLights />
          <group scale={0.82}>
            <Model
              url={modelUrl}
              onMeshClick={onMeshClick}
              onMeshesLoaded={onMeshesLoaded}
              width={width}
              height={height}
              depth={depth}
              woodConfig={woodConfig}
              onLoaded={handleModelLoaded}
            />
          </group>
          <DynamicOrbitControls
            controlsRef={controlsRef}
            onCameraChange={handleCameraChange}
            objWidth={Math.max(width || 100, depth || 100)}
            objHeight={height || 180}
          />
        </Suspense>
      </Canvas>

      <div className="absolute left-4 top-4">
        <button
          onClick={internalReset}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-[10px] font-bold text-white shadow-lg transition-all hover:bg-black/80"
          title="Reiniciar Vista"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          RESET
        </button>
      </div>

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 px-6 text-center">
          <div className="max-w-xs space-y-4">
            <p className="text-sm font-medium text-white">
              El visor 3D perdio el contexto WebGL. Reinicialo para evitar la pantalla en blanco.
            </p>
            <button
              type="button"
              onClick={handleContextReset}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black"
            >
              Reiniciar visor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center text-white">
        <div className="mb-2 h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-emerald-500" />
        <p className="text-sm font-medium">Cargando experiencia 3D...</p>
      </div>
    </Html>
  );
}

useGLTF.preload("/models/base.glb");
