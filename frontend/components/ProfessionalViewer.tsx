"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stage, 
  Bounds, 
  useGLTF, 
  Html,
  useCursor
} from "@react-three/drei";
import * as THREE from "three";

// --- Tipos ---
interface MeshNode {
  name: string;
  uuid: string;
  visible: boolean;
}

interface ProfessionalViewerProps {
  modelUrl: string;
  onMeshClick?: (meshName: string) => void;
}

// --- Componente de Modelo ---
const Model = ({ url, setMeshList, onMeshClick }: { 
  url: string, 
  setMeshList: (list: MeshNode[]) => void,
  onMeshClick?: (name: string) => void 
}) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(!!hovered);

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
  }, [scene, setMeshList]);

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
export default function ProfessionalViewer({ modelUrl, onMeshClick }: ProfessionalViewerProps) {
  const [meshList, setMeshList] = useState<MeshNode[]>([]);
  const [visibleMeshes, setVisibleMeshes] = useState<Record<string, boolean>>({});

  const toggleMeshVisibility = (name: string) => {
    setVisibleMeshes(prev => ({
      ...prev,
      [name]: prev[name] === false
    }));
  };

  return (
    <div className="relative w-full h-[600px] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl">
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true 
        }}
        dpr={[1, 2]} // Performance: limit DPI for high-res screens
      >
        <Suspense fallback={<Loader />}>
          {/* Iluminación y Entorno */}
          <Stage 
            intensity={0.5} 
            environment="city" 
            shadows={{ type: 'contact', opacity: 0.4, blur: 2 }} 
            adjustCamera={false}
          >
            <Bounds fit clip>
              <Model 
                url={modelUrl} 
                setMeshList={setMeshList}
                onMeshClick={onMeshClick}
              />
            </Bounds>
          </Stage>

          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.75} 
            enableDamping
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay para control de Meshes */}
      <div className="absolute top-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs max-h-[80%] overflow-y-auto w-48">
        <h3 className="font-bold mb-2 uppercase tracking-wider">Meshes detectados</h3>
        <ul className="space-y-1">
          {meshList.map(mesh => (
            <li key={mesh.uuid} className="flex items-center justify-between gap-2">
              <span className="truncate">{mesh.name || 'Sin nombre'}</span>
              <button 
                onClick={() => toggleMeshVisibility(mesh.name)}
                className={`px-2 py-0.5 rounded ${visibleMeshes[mesh.name] === false ? 'bg-red-500' : 'bg-emerald-500'}`}
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
