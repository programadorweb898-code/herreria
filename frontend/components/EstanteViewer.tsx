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
    
    // Clonamos la escena original para no mutar el modelo base
    const scene = sourceScene.clone(true);
    
    // Aplicamos el escalado base al contenedor principal
    scene.scale.set(width, height, depth);

    // Función recursiva para procesar objetos y evitar doble escalado en adornos
    const processObject = (obj: THREE.Object3D) => {
      const name = obj.name.toLowerCase();
      
      // 1. Detección exhaustiva de ADORNOS (No deben deformarse)
      const isAdorno = 
        name.includes("vino") || name.includes("botella") || name.includes("bottle") || 
        name.includes("decor") || name.includes("adorno") || name.includes("glass") || 
        name.includes("copa") || name.includes("planta") || name.includes("plant") ||
        name.includes("libro") || name.includes("book") || name.includes("percha") ||
        name.includes("hanger") || name.includes("zapat") || name.includes("shoe") ||
        name.includes("objeto") || name.includes("object") || name.includes("maceta") ||
        name.includes("cuadro") || name.includes("frame") || name.includes("lamp") ||
        name.includes("vela") || name.includes("candle") || name.includes("vaso") ||
        name.includes("pot") || name.includes("comida") || name.includes("food") ||
        name.includes("canasto") || name.includes("basket") || name.includes("tv") ||
        name.includes("parlante") || name.includes("speaker");

      if (isAdorno) {
        // Compensamos la escala del padre manteniendo la escala original del objeto
        // Si el objeto ya tenía una escala (ej: 0.5), la mantenemos y solo compensamos el estiramiento
        obj.scale.set(
          obj.scale.x / width,
          obj.scale.y / height,
          obj.scale.z / depth
        );
        // IMPORTANTE: Si es un adorno, NO procesamos sus hijos, 
        // ya que la compensación del padre ya los protege a todos.
        return;
      }

      // 2. Detección de ESTRUCTURA (Madera y Hierro)
      if (obj instanceof THREE.Mesh) {
        const isWood = name.includes("madera") || name.includes("wood") || name.includes("estante") || name.includes("shelf") || name.includes("tabla");
        const isIron = name.includes("hierro") || name.includes("iron") || name.includes("metal") || name.includes("caño") || name.includes("frame") || name.includes("pata") || name.includes("perfil");

        if (isWood || isIron) {
          if (isWood) {
            // Un estante de madera: preservamos grosor (Y) y profundidad (Z)
            obj.scale.set(1, 1 / height, 1 / depth);
          } else if (isIron) {
            // Lógica de perfiles metálicos
            if (name.includes("vertical") || name.includes("pata") || name.includes("columna")) {
              obj.scale.set(1 / width, 1, 1 / depth);
            } else if (name.includes("horizontal") || name.includes("travesaño") || name.includes("barra")) {
              obj.scale.set(1, 1 / height, 1 / depth);
            } else {
              // Por defecto para piezas pequeñas de hierro, compensamos parcialmente para que no se vean raras
              obj.scale.set(1 / (width * 0.5 + 0.5), 1 / (height * 0.5 + 0.5), 1 / (depth * 0.5 + 0.5));
            }
          }
        }
      }

      // Procesar hijos recursivamente
      if (obj.children) {
        obj.children.forEach(processObject);
      }
    };

    // Iniciamos el procesamiento desde los hijos de la escena clonada
    scene.children.forEach(processObject);
    scene.updateMatrixWorld(true);
    
    return scene;
  }, [sourceScene, width, height, depth]);

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
    <div className="h-[350px] sm:h-[400px] md:h-[500px] w-full max-w-full overflow-hidden bg-[#f8f8f8] rounded-xl border border-slate-200 shadow-sm relative">
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

          <Center>
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
