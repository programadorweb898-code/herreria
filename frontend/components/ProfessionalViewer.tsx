"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
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
                       name.includes('madera');

        if (isWood) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(woodConfig.color),
            roughness: woodConfig.roughness,
            metalness: 0.1,
            envMapIntensity: 1
          });
        } else if (name.includes('frame') || name.includes('metal') || name.includes('hierro') || name.includes('base')) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#121212'),
            roughness: 0.4,
            metalness: 0.8
          });
        }
      }
    });
  }, [scene, woodConfig]);

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
  }, [scene, setMeshList, onLoaded]);

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
  const [meshList, setMeshList] = useState<MeshNode[]>([]);
  const [visibleMeshes, setVisibleMeshes] = useState<Record<string, boolean>>({});
  const [shouldAdjust, setShouldAdjust] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const hasCameraState = !!cameraState;
  useEffect(() => {
    // Si ya tenemos un zoom guardado, desactivamos el ajuste automático del Stage
    // para evitar que "pelee" con nuestra posición guardada.
    setShouldAdjust(!hasCameraState);
  }, [modelUrl, hasCameraState]);

  const toggleMeshVisibility = (name: string) => {
    setVisibleMeshes(prev => ({
      ...prev,
      [name]: prev[name] === false
    }));
  };

  const handleModelLoaded = () => {
    // Si hay un estado guardado para este producto, lo aplicamos al terminar de cargar
    if (cameraState && controlsRef.current) {
      const { position, target } = cameraState;
      controlsRef.current.object.position.set(...position);
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
      setShouldAdjust(false);
    } else {
      // Si no hay estado, dejamos que Stage ajuste y luego desactivamos el ajuste continuo
      setTimeout(() => {
        setShouldAdjust(false);
      }, 100);
    }
  };

  const internalReset = () => {
    setShouldAdjust(true);
    if (onReset) onReset();
  };

  const handleCameraChange = () => {
    if (onCameraChange && controlsRef.current) {
      const position = controlsRef.current.object.position.toArray() as [number, number, number];
      const target = controlsRef.current.target.toArray() as [number, number, number];
      onCameraChange({ position, target });
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-900 rounded-xl overflow-hidden shadow-2xl">
      <Canvas
        shadows
        camera={{ fov: 45, position: [0, 0, 10] }}
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
            shadows={{ type: 'contact', opacity: 0.4, blur: 2 }} 
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

          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI} 
            enableDamping
            onStart={() => setShouldAdjust(false)}
            onEnd={handleCameraChange}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay mejorada con Reset */}
      <div className="absolute top-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs max-h-[70%] overflow-y-auto w-52 border border-white/10">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
          <h3 className="font-bold uppercase tracking-wider text-emerald-400">Panel 3D</h3>
          <button 
            onClick={internalReset}
            className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-black rounded text-[10px] font-bold transition-all flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            RESET
          </button>
        </div>
        
        <p className="text-[10px] text-neutral-400 mb-3 italic">Las medidas y materiales persisten al cambiar de modelo.</p>

        <h3 className="font-medium mb-2 text-neutral-300 uppercase text-[9px] tracking-widest">Piezas detectadas</h3>
        <ul className="space-y-1">
          {meshList.map(mesh => (
            <li key={mesh.uuid} className="flex items-center justify-between gap-2 p-1 hover:bg-white/5 rounded transition-colors">
              <span className="truncate max-w-[100px] text-neutral-400">{mesh.name || 'Componente'}</span>
              <button 
                onClick={() => toggleMeshVisibility(mesh.name)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${visibleMeshes[mesh.name] === false ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
              >
                {visibleMeshes[mesh.name] === false ? 'Oculto' : 'Visible'}
              </button>
            </li>
          ))}
        </ul>
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
