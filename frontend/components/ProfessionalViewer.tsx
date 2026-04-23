"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stage, 
  useGLTF, 
  Html,
  useCursor
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// --- Tipos ---
export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

interface MeshNode {
  name: string;
  uuid: string;
  visible: boolean;
}

interface ProfessionalViewerProps {
  modelUrl: string;
  onMeshClick?: (meshName: string) => void;
  width?: number;
  height?: number;
  depth?: number;
  woodConfig?: { color: string; roughness: number };
  onReset?: () => void;
  cameraState?: CameraState;
  onCameraChange?: (state: CameraState) => void;
}

// --- Componente de Controles Dinámicos ---
const DynamicOrbitControls = ({ 
  controlsRef, 
  onCameraChange, 
  setShouldAdjust,
  objWidth,
  objHeight
}: { 
  controlsRef: React.RefObject<OrbitControlsImpl>, 
  onCameraChange: () => void, 
  setShouldAdjust: (val: boolean) => void,
  objWidth: number,
  objHeight: number
}) => {
  const { size, camera } = useThree();
  
  // Calculamos la distancia necesaria para que el objeto ocupe X porcentaje
  const getDistanceForPercent = (percent: number) => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    
    // Distancia para ancho y alto
    const distW = (objWidth / percent) / (2 * Math.tan(fovRad / 2) * aspect);
    const distH = (objHeight / percent) / (2 * Math.tan(fovRad / 2));
    
    return Math.max(distW, distH);
  };

  // minDistance: objeto al 120% (permite ver de cerca)
  const minDistance = getDistanceForPercent(1.2);
  // maxDistance: objeto al 15% (permite alejarse más)
  const maxDistance = getDistanceForPercent(0.15);

  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault 
      enableZoom={true}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={0} 
      maxPolarAngle={Math.PI} 
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      onStart={() => setShouldAdjust(false)}
      onEnd={onCameraChange}
    />
  );
};

// --- Utilidad para generar textura de madera ---
const createWoodTexture = (baseColor: string) => {
  if (typeof document === 'undefined') return null;
  
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Fondo base
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Añadir vetas de madera
  const colorObj = new THREE.Color(baseColor);
  const darkerColor = `#${colorObj.clone().multiplyScalar(0.8).getHexString()}`;

  ctx.strokeStyle = darkerColor;
  ctx.lineWidth = 2;

  // Dibujar líneas irregulares para simular vetas
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.globalAlpha = Math.random() * 0.3;
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    
    for (let j = 0; j < 10; j++) {
      x += (Math.random() - 0.5) * 20;
      y += 51.2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Añadir nudos ocasionales
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.globalAlpha = Math.random() * 0.2;
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    ctx.ellipse(nx, ny, Math.random() * 40, Math.random() * 20, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = darkerColor;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

// --- Componente de Modelo ---
const Model = ({ url, setMeshList, onMeshClick, width, height, depth, woodConfig, onLoaded }: { 
  url: string, 
  setMeshList: (list: MeshNode[]) => void,
  onMeshClick?: (name: string) => void,
  width?: number,
  height?: number,
  depth?: number,
  woodConfig?: { color: string; roughness: number },
  onLoaded?: () => void
}) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(!!hovered);

  // Aplicar material de madera
  useEffect(() => {
    if (!woodConfig) return;

    const woodTexture = createWoodTexture(woodConfig.color);

    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const name = mesh.name.toLowerCase();
        
        const isWood = name.includes('wood') || 
                       name.includes('tablero') || 
                       name.includes('estante') || 
                       name.includes('board') || 
                       name.includes('shelf') || 
                       name.includes('top') ||
                       name.includes('madera') ||
                       name.includes('mueble') ||
                       name.includes('box');

        if (isWood) {
          // Si el material ya existe, actualizamos sus propiedades
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.map = woodTexture;
            mesh.material.color = new THREE.Color(woodConfig.color);
            mesh.material.roughness = woodConfig.roughness;
            mesh.material.needsUpdate = true; // Marcar para que Three.js actualice el material
          } else {
            // Si no, creamos uno nuevo
            mesh.material = new THREE.MeshStandardMaterial({
              map: woodTexture,
              color: new THREE.Color(woodConfig.color),
              roughness: woodConfig.roughness,
              metalness: 0.05,
              bumpMap: woodTexture,
              bumpScale: 0.02,
              envMapIntensity: 0.8
            });
          }
        } else if (name.includes('frame') || name.includes('metal') || name.includes('hierro') || name.includes('base') || name.includes('structure')) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#1a1a1a'),
            roughness: 0.3,
            metalness: 0.9,
            envMapIntensity: 1.5
          });
        }
      }
    });
  // Añadimos woodConfig.color y woodConfig.roughness a las dependencias para asegurar que el efecto se ejecute
  // cuando cambien los valores específicos de color o rugosidad.
  }, [scene, woodConfig, woodConfig?.color, woodConfig?.roughness]);

  useEffect(() => {
    const meshes: MeshNode[] = [];
    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        meshes.push({
          name: node.name,
          uuid: node.uuid,
          visible: node.visible
        });
      }
    });
    setMeshList(meshes);

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    if (onLoaded) onLoaded();
  }, [scene, setMeshList]); // Quitamos onLoaded de dependencias para evitar loops

  useEffect(() => {
    if (width && height && depth) {
      scene.scale.set(1, 1, 1);
      const currentBox = new THREE.Box3().setFromObject(scene);
      const currentSize = new THREE.Vector3();
      currentBox.getSize(currentSize);
      
      scene.scale.set(
        width / (currentSize.x || 1),
        height / (currentSize.y || 1),
        depth / (currentSize.z || 1)
      );

      const newBox = new THREE.Box3().setFromObject(scene);
      const newCenter = new THREE.Vector3();
      newBox.getCenter(newCenter);
      scene.position.sub(newCenter);
    }
  }, [width, height, depth, scene]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onMeshClick) onMeshClick((e.object as THREE.Mesh).name);
  };

  return (
    <primitive 
      object={scene} 
      onClick={handleClick}
      onPointerOver={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setHovered((e.object as THREE.Mesh).name);
      }}
      onPointerOut={() => setHovered(null)}
    />
  );
};

// --- Visor Principal ---
export default function ProfessionalViewer({ modelUrl, onMeshClick, width, height, depth, woodConfig, onReset, cameraState, onCameraChange }: ProfessionalViewerProps) {
  const [shouldAdjust, setShouldAdjust] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_meshList, setMeshList] = useState<MeshNode[]>([]);

  const hasCameraState = !!cameraState;
  
  useEffect(() => {
    setShouldAdjust(!hasCameraState);
  }, [modelUrl, hasCameraState]);

  // const toggleMeshVisibility = (name: string) => {
  //   setVisibleMeshes(prev => ({
  //     ...prev,
  //     [name]: prev[name] === false
  //   }));
  // };

  const handleModelLoaded = React.useCallback(() => {
    if (cameraState && controlsRef.current) {
      const { position, target } = cameraState;
      controlsRef.current.object.position.set(...position);
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
      setShouldAdjust(false);
    } else {
      setTimeout(() => {
        setShouldAdjust(false);
      }, 100);
    }
  }, [cameraState]);

  const internalReset = () => {
    setShouldAdjust(true);
    if (onReset) onReset();
  };

  const handleCameraChange = React.useCallback(() => {
    if (onCameraChange && controlsRef.current) {
      const position = controlsRef.current.object.position.toArray() as [number, number, number];
      const target = controlsRef.current.target.toArray() as [number, number, number];
      onCameraChange({ position, target });
    }
  }, [onCameraChange]);

  return (
    <div className="relative w-full h-full bg-neutral-900 rounded-xl overflow-hidden shadow-2xl touch-none">
      <Canvas
        shadows
        camera={{ fov: 45, position: [200, 200, 200] }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true 
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          <Stage 
            intensity={0.5} 
            environment="city" 
            shadows={false} 
            adjustCamera={shouldAdjust}
          >
            <group scale={0.85}>
              <Model 
                url={modelUrl} 
                setMeshList={setMeshList}
                onMeshClick={onMeshClick}
                width={width}
                height={height}
                depth={depth}
                woodConfig={woodConfig}
                onLoaded={handleModelLoaded}
              />
            </group>
          </Stage>

          <DynamicOrbitControls 
            controlsRef={controlsRef}
            onCameraChange={handleCameraChange}
            setShouldAdjust={setShouldAdjust}
            objWidth={Math.max(width || 100, depth || 100)}
            objHeight={height || 180}
          />
        </Suspense>
      </Canvas>

      {/* Botón de Reset */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={internalReset}
          className="px-3 py-2 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 border border-white/10 shadow-lg"
          title="Reiniciar Vista"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          RESET
        </button>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center text-white">
        <div className="w-10 h-10 border-4 border-t-emerald-500 border-neutral-700 rounded-full animate-spin mb-2" />
        <p className="text-sm font-medium">Cargando experiencia 3D...</p>
      </div>
    </Html>
  );
}
