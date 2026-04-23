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
  width?: number;
  height?: number;
  depth?: number;
  woodConfig?: { color: string; roughness: number };
}

// --- Componente de Modelo ---
const Model = ({ url, setMeshList, onMeshClick, width, height, depth, woodConfig }: { 
  url: string, 
  setMeshList: (list: MeshNode[]) => void,
  onMeshClick?: (name: string) => void,
  width?: number,
  height?: number,
  depth?: number,
  woodConfig?: { color: string; roughness: number }
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
        
        // Identificar si es una parte de madera
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
          // Aseguramos que el metal sea negro mate/satinado industrial
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

    // Centrado geométrico inicial
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
  }, [scene, setMeshList]);

  // Aplicar escalado en tiempo real
  useEffect(() => {
    if (width && height && depth) {
      // Calculamos el tamaño original del modelo para escalar correctamente
      // Nota: Esto asume que las dimensiones proporcionadas son el objetivo final
      // en una escala consistente (ej: 1 unit = 1cm o 1 unit = 1m)
      // Para este caso, vamos a escalar el objeto para que su bounding box coincida con las medidas.
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Aplicamos el escalado al objeto raíz de la escena
      // Ajuste simplificado: si queremos que mida 'width' de ancho, etc.
      // Usamos el tamaño actual sin escala para determinar el factor.
      scene.scale.set(1, 1, 1);
      const currentBox = new THREE.Box3().setFromObject(scene);
      const currentSize = new THREE.Vector3();
      currentBox.getSize(currentSize);
      
      scene.scale.set(
        width / (currentSize.x || 1),
        height / (currentSize.y || 1),
        depth / (currentSize.z || 1)
      );

      // Re-centrar después de escalar
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
export default function ProfessionalViewer({ modelUrl, onMeshClick, width, height, depth }: ProfessionalViewerProps) {
  const [meshList, setMeshList] = useState<MeshNode[]>([]);
  const [visibleMeshes, setVisibleMeshes] = useState<Record<string, boolean>>({});

  const toggleMeshVisibility = (name: string) => {
    setVisibleMeshes(prev => ({
      ...prev,
      [name]: prev[name] === false
    }));
  };

  return (
    <div className="relative w-full h-full bg-neutral-900 rounded-xl overflow-hidden shadow-2xl">
      <Canvas
        shadows
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
            adjustCamera={true}
          >
            <Bounds fit clip>
              <Model 
                url={modelUrl} 
                setMeshList={setMeshList}
                onMeshClick={onMeshClick}
                width={width}
                height={height}
                depth={depth}
                woodConfig={woodConfig}
              />
            </Bounds>
          </Stage>

          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI} 
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
