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

    // Escala base para el contenedor principal
    clonedScene.scale.set(width, height, depth);

    // Recorremos todos los objetos del modelo para aplicar compensaciones
    clonedScene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Group) {
        const name = obj.name.toLowerCase();
        
        // 1. Detección de ADORNOS (No deben deformarse NUNCA)
        const isAdorno = 
          name.includes("vino") || name.includes("botella") || name.includes("bottle") || 
          name.includes("decor") || name.includes("adorno") || name.includes("glass") || 
          name.includes("copa") || name.includes("planta") || name.includes("plant") ||
          name.includes("libro") || name.includes("book") || name.includes("percha") ||
          name.includes("hanger") || name.includes("zapat") || name.includes("shoe") ||
          name.includes("objeto") || name.includes("object") || name.includes("maceta");

        if (isAdorno) {
          // Inversión total de la escala del padre para mantener proporciones reales
          obj.scale.set(1 / width, 1 / height, 1 / depth);
          return; // Si es adorno, no aplicamos lógica de estructura
        }

        // 2. Detección de ESTRUCTURA (Madera y Hierro)
        const isWood = name.includes("madera") || name.includes("wood") || name.includes("estante") || name.includes("shelf") || name.includes("tabla");
        const isIron = name.includes("hierro") || name.includes("iron") || name.includes("metal") || name.includes("caño") || name.includes("frame") || name.includes("pata");

        if (isWood || isIron) {
          // Lógica Senior de Preservación de Grosores:
          // Si el objeto es predominantemente horizontal (como un estante):
          // - Queremos que el ancho (X) cambie con 'width'.
          // - Queremos que el grosor (Y) y profundidad (Z) se mantengan CONSTANTES.
          
          // Nota: En modelos GLB, la orientación depende de cómo se exportó. 
          // Intentamos compensar basándonos en el nombre y la intención:
          
          if (isWood) {
            // Un estante de madera: preservamos grosor (Y) y profundidad (Z)
            // Solo dejamos que el escalado del padre afecte el largo (X)
            obj.scale.set(1, 1 / height, 1 / depth);
          } else if (isIron) {
            // Un caño estructural:
            // Si es un parante vertical, queremos que mantenga su sección (X, Z) pero cambie su altura (Y)
            if (name.includes("vertical") || name.includes("pata") || name.includes("columna")) {
              obj.scale.set(1 / width, 1, 1 / depth);
            } 
            // Si es un travesaño horizontal, queremos que mantenga su sección (Y, Z) pero cambie su largo (X)
            else if (name.includes("horizontal") || name.includes("travesaño") || name.includes("barra")) {
              obj.scale.set(1, 1 / height, 1 / depth);
            }
            // Por defecto para hierro, intentamos que no se "engrose" visualmente de forma exagerada
            else {
              obj.scale.set(1 / (width * 0.5 + 0.5), 1 / (height * 0.5 + 0.5), 1 / (depth * 0.5 + 0.5));
            }
          }
        }
      }
    });

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
    <div className="h-[500px] w-full overflow-hidden bg-[#f8f8f8] rounded-xl border border-slate-200 shadow-sm relative">
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Vista 3D Interactiva
          </p>
        </div>
      </div>
      <Suspense fallback={<ViewerFallback />}>
        <Canvas 
          key={modelPath}
          camera={{ position: [3, 2, 3], fov: 45 }}
          shadows
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <color attach="background" args={["#f8f8f8"]} />
          <fog attach="fog" args={["#f8f8f8", 5, 15]} />
          
          <ambientLight intensity={0.8} />
          
          {/* Main Studio Light */}
          <spotLight 
            position={[5, 8, 5]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          
          {/* Rim Light */}
          <pointLight position={[-5, 5, -5]} intensity={1} color="#ffffff" />
          
          {/* Fill Light */}
          <directionalLight position={[0, -2, 4]} intensity={0.5} />

          <Center top>
            <EstanteModel 
              width={width} 
              height={height} 
              depth={depth} 
              modelPath={modelPath} 
            />
          </Center>

          {/* Ground Shadow Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial transparent opacity={0.1} />
          </mesh>

          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            makeDefault 
            minDistance={1.5}
            maxDistance={6}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload(DEFAULT_MODEL_PATH);
