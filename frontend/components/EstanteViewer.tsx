"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

const DEFAULT_MODEL_PATH = "/models/Estanteria.glb";
const BODEGA_MILAN_SLUG = "estanteria-pared-lineal";

interface Props {
  width?: number;
  height?: number;
  depth?: number;
  modelPath?: string | null;
  productSlug?: string | null;
}

function EstanteModel({
  width = 1,
  height = 1,
  depth = 1,
  modelPath,
  productSlug,
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

    // Para la Bodega Milán, calculamos cuántos vinos hay (1 vino = 10cm = 0.1 unidades)
    const numWines = productSlug === BODEGA_MILAN_SLUG ? Math.round(height / 0.1) : 0;
    const wineTemplates: THREE.Object3D[] = [];
    const holderTemplates: THREE.Object3D[] = [];

    // Función recursiva para procesar objetos y evitar doble escalado en adornos
    const processObject = (obj: THREE.Object3D) => {
      const name = obj.name.toLowerCase();
      
      // 1. Detección exhaustiva de ADORNOS (No deben deformarse)
      const isWine = name.includes("vino") || name.includes("wine") || name.includes("botella") || name.includes("bottle");
      const isHolder = name.includes("soporte") || name.includes("holder") || name.includes("aro") || name.includes("ring");
      const isAdorno = 
        isWine ||
        name.includes("decor") || name.includes("adorno") || name.includes("deco") || name.includes("prop") ||
        name.includes("glass") || name.includes("copa") || name.includes("cup") || 
        name.includes("planta") || name.includes("plant") || name.includes("leaf") ||
        name.includes("libro") || name.includes("book") || name.includes("percha") ||
        name.includes("hanger") || name.includes("zapat") || name.includes("shoe") ||
        name.includes("objeto") || name.includes("object") || name.includes("maceta") ||
        name.includes("cuadro") || name.includes("frame") || name.includes("lamp") ||
        name.includes("vela") || name.includes("candle") || name.includes("vaso") ||
        name.includes("pot") || name.includes("comida") || name.includes("food") ||
        name.includes("canasto") || name.includes("basket") || name.includes("tv") ||
        name.includes("parlante") || name.includes("speaker") || name.includes("acc");

      if (isAdorno) {
        // Si es Bodega Milán, guardamos una plantilla de la primera botella que encontremos y la ocultamos
        if (productSlug === BODEGA_MILAN_SLUG && isWine) {
          if (wineTemplates.length === 0) {
             // Guardamos una copia sin el escalado del padre
             const template = obj.clone();
             wineTemplates.push(template);
          }
          obj.visible = false;
          return;
        }

        // Compensamos la escala del padre manteniendo la escala original del objeto
        obj.scale.set(
          obj.scale.x / width,
          obj.scale.y / height,
          obj.scale.z / depth
        );
        return;
      }

      // 2. Detección de ESTRUCTURA (Madera y Hierro)
      if (obj instanceof THREE.Mesh) {
        // Si es Bodega Milán y es un soporte (hierro que se repite), lo guardamos y ocultamos
        if (productSlug === BODEGA_MILAN_SLUG && isHolder) {
          if (holderTemplates.length === 0) {
            const template = obj.clone();
            holderTemplates.push(template);
          }
          obj.visible = false;
          return;
        }

        const isWood = 
          name.includes("madera") || name.includes("wood") || 
          name.includes("estante") || name.includes("shelf") || 
          name.includes("tabla") || name.includes("plank") || 
          name.includes("board") || name.includes("panel") ||
          name.includes("top") || name.includes("timber");

        const isIron = 
          name.includes("hierro") || name.includes("iron") || 
          name.includes("metal") || name.includes("steel") ||
          name.includes("caño") || name.includes("pipe") || name.includes("tube") ||
          name.includes("frame") || name.includes("pata") || name.includes("leg") ||
          name.includes("perfil") || name.includes("structure") || name.includes("support") ||
          isHolder;

        if (isWood || isIron) {
          if (isWood) {
            // Un estante de madera: preservamos grosor (Y) y profundidad (Z)
            obj.scale.set(1, 1 / height, 1 / depth);
          } else if (isIron) {
            // Lógica de perfiles metálicos
            const isVertical = 
              name.includes("vertical") || name.includes("pata") || name.includes("leg") ||
              name.includes("columna") || name.includes("column") || name.includes("post") ||
              name.includes("upright");
            
            const isHorizontal = 
              name.includes("horizontal") || name.includes("travesaño") || name.includes("barra") ||
              name.includes("bar") || name.includes("beam") || name.includes("rail") ||
              name.includes("support") || name.includes("cross");

            if (isVertical) {
              obj.scale.set(1 / width, 1, 1 / depth);
            } else if (isHorizontal) {
              obj.scale.set(1, 1 / height, 1 / depth);
            } else {
              // Por defecto para piezas pequeñas de hierro, compensamos parcialmente
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

    // Si es Bodega Milán, añadimos las botellas y soportes repetidos
    if (productSlug === BODEGA_MILAN_SLUG && numWines > 0) {
      const templateWine = wineTemplates[0];
      const templateHolder = holderTemplates[0];

      for (let i = 0; i < numWines; i++) {
        // Posición Y local: cada vino a 0.1 unidades (10cm) de distancia
        // Pero como el contenedor está escalado por 'height' (ej 0.5), 
        // 0.1 unidades reales son 0.1 / height unidades locales
        const localY = (i * 0.1 + 0.05) / height;

        if (templateHolder) {
          const holder = templateHolder.clone();
          holder.position.y = localY;
          // Compensamos la escala del padre en el soporte también si es un mesh individual
          holder.scale.set(1 / width, 1 / height, 1 / depth);
          scene.add(holder);
        }

        if (templateWine) {
          const wine = templateWine.clone();
          wine.position.y = localY;
          // Las botellas ya vienen compensadas del template o se compensan aquí
          wine.scale.set(
            templateWine.scale.x / width,
            templateWine.scale.y / height,
            templateWine.scale.z / depth
          );
          scene.add(wine);
        }
      }
    }

    scene.updateMatrixWorld(true);
    
    return scene;
  }, [sourceScene, width, height, depth, productSlug]);

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
  productSlug = null,
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
          key={`${modelPath}-${productSlug}`}
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
              productSlug={productSlug}
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
