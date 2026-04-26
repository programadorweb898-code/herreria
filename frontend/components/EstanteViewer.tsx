"use client";

import { Suspense, memo, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { getCanvasDpr, isSafariBrowser } from "@/components/three/performance";

const DEFAULT_MODEL_PATH = "/models/Estanteria.glb";
const BODEGA_MILAN_SLUG = "estanteria-pared-lineal";

interface Props {
  width?: number;
  height?: number;
  depth?: number;
  modelPath?: string | null;
  productSlug?: string | null;
}

const EstanteModel = memo(function EstanteModel({
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

    const scene = sourceScene.clone(true);
    scene.scale.set(width, height, depth);

    const numWines = productSlug === BODEGA_MILAN_SLUG ? Math.round(height / 0.1) : 0;
    const wineTemplates: THREE.Object3D[] = [];
    const holderTemplates: THREE.Object3D[] = [];

    const processObject = (obj: THREE.Object3D) => {
      const name = obj.name.toLowerCase();
      const isWine =
        name.includes("vino") || name.includes("wine") || name.includes("botella") || name.includes("bottle");
      const isHolder =
        name.includes("soporte") || name.includes("holder") || name.includes("aro") || name.includes("ring");
      const isAdorno =
        isWine ||
        name.includes("decor") ||
        name.includes("adorno") ||
        name.includes("deco") ||
        name.includes("prop") ||
        name.includes("glass") ||
        name.includes("copa") ||
        name.includes("cup") ||
        name.includes("planta") ||
        name.includes("plant") ||
        name.includes("leaf") ||
        name.includes("libro") ||
        name.includes("book") ||
        name.includes("percha") ||
        name.includes("hanger") ||
        name.includes("zapat") ||
        name.includes("shoe") ||
        name.includes("objeto") ||
        name.includes("object") ||
        name.includes("maceta") ||
        name.includes("cuadro") ||
        name.includes("frame") ||
        name.includes("lamp") ||
        name.includes("vela") ||
        name.includes("candle") ||
        name.includes("vaso") ||
        name.includes("pot") ||
        name.includes("comida") ||
        name.includes("food") ||
        name.includes("canasto") ||
        name.includes("basket") ||
        name.includes("tv") ||
        name.includes("parlante") ||
        name.includes("speaker") ||
        name.includes("acc");

      if (isAdorno) {
        if (productSlug === BODEGA_MILAN_SLUG && isWine) {
          if (wineTemplates.length === 0) {
            wineTemplates.push(obj.clone());
          }
          obj.visible = false;
          return;
        }

        obj.scale.set(obj.scale.x / width, obj.scale.y / height, obj.scale.z / depth);
        return;
      }

      if (obj instanceof THREE.Mesh) {
        if (productSlug === BODEGA_MILAN_SLUG && isHolder) {
          if (holderTemplates.length === 0) {
            holderTemplates.push(obj.clone());
          }
          obj.visible = false;
          return;
        }

        const isWood =
          name.includes("madera") ||
          name.includes("wood") ||
          name.includes("estante") ||
          name.includes("shelf") ||
          name.includes("tabla") ||
          name.includes("plank") ||
          name.includes("board") ||
          name.includes("panel") ||
          name.includes("top") ||
          name.includes("timber");

        const isIron =
          name.includes("hierro") ||
          name.includes("iron") ||
          name.includes("metal") ||
          name.includes("steel") ||
          name.includes("cano") ||
          name.includes("pipe") ||
          name.includes("tube") ||
          name.includes("frame") ||
          name.includes("pata") ||
          name.includes("leg") ||
          name.includes("perfil") ||
          name.includes("structure") ||
          name.includes("support") ||
          isHolder;

        if (isWood || isIron) {
          if (isWood) {
            obj.scale.set(1, 1 / height, 1 / depth);
          } else if (isIron) {
            const isVertical =
              name.includes("vertical") ||
              name.includes("pata") ||
              name.includes("leg") ||
              name.includes("columna") ||
              name.includes("column") ||
              name.includes("post") ||
              name.includes("upright");

            const isHorizontal =
              name.includes("horizontal") ||
              name.includes("travesano") ||
              name.includes("barra") ||
              name.includes("bar") ||
              name.includes("beam") ||
              name.includes("rail") ||
              name.includes("support") ||
              name.includes("cross");

            if (isVertical) {
              obj.scale.set(1 / width, 1, 1 / depth);
            } else if (isHorizontal) {
              obj.scale.set(1, 1 / height, 1 / depth);
            } else {
              obj.scale.set(
                1 / (width * 0.5 + 0.5),
                1 / (height * 0.5 + 0.5),
                1 / (depth * 0.5 + 0.5),
              );
            }
          }
        }
      }

      obj.children?.forEach(processObject);
    };

    scene.children.forEach(processObject);

    if (productSlug === BODEGA_MILAN_SLUG && numWines > 0) {
      const templateWine = wineTemplates[0];
      const templateHolder = holderTemplates[0];

      for (let i = 0; i < numWines; i += 1) {
        const localY = (i * 0.1 + 0.05) / height;

        if (templateHolder) {
          const holder = templateHolder.clone();
          holder.position.y = localY;
          holder.scale.set(templateHolder.scale.x, templateHolder.scale.y / height, templateHolder.scale.z);
          scene.add(holder);
        }

        if (templateWine) {
          const wine = templateWine.clone();
          wine.position.y = localY;
          wine.scale.set(templateWine.scale.x, templateWine.scale.y / height, templateWine.scale.z);
          scene.add(wine);
        }
      }
    }

    scene.updateMatrixWorld(true);
    return scene;
  }, [sourceScene, width, height, depth, productSlug]);

  if (!sourceScene || !clonedScene) return null;
  return <primitive object={clonedScene} />;
});

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
  const [contextLost, setContextLost] = useState(false);
  const [contextResetKey, setContextResetKey] = useState(0);
  const canvasCleanupRef = useRef<(() => void) | null>(null);
  const isSafari = isSafariBrowser();
  const dpr = getCanvasDpr();

  useEffect(() => {
    return () => {
      canvasCleanupRef.current?.();
    };
  }, []);

  return (
    <div className="relative h-[350px] w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-[#f8f8f8] shadow-sm sm:h-[400px] md:h-[500px]">
      <div className="absolute left-4 top-4 z-10">
        <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 backdrop-blur-sm shadow-sm">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Vista 3D Interactiva
          </p>
        </div>
      </div>
      <Suspense fallback={<ViewerFallback />}>
        <Canvas
          key={`${modelPath}-${productSlug}-${contextResetKey}`}
          camera={{ position: [3, 2, 3], fov: 45 }}
          dpr={dpr}
          gl={{
            antialias: false,
            alpha: false,
            preserveDrawingBuffer: false,
            powerPreference: isSafari ? "low-power" : "high-performance",
          }}
          onCreated={({ gl, invalidate }) => {
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
          <color attach="background" args={["#f8f8f8"]} />
          <fog attach="fog" args={["#f8f8f8", 5, 15]} />
          <ambientLight intensity={0.85} />
          <hemisphereLight args={["#ffffff", "#d9d9d9", 0.35]} />
          <directionalLight position={[4, 6, 5]} intensity={0.95} />
          <directionalLight position={[-3, 2, -3]} intensity={0.25} />

          <Center>
            <EstanteModel
              width={width}
              height={height}
              depth={depth}
              modelPath={modelPath}
              productSlug={productSlug}
            />
          </Center>

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            makeDefault
            minDistance={1.5}
            maxDistance={6}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>
      </Suspense>

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 px-6 text-center">
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700">
              El visor perdio el contexto WebGL. Reinicialo para recuperar la escena.
            </p>
            <button
              type="button"
              onClick={() => {
                setContextLost(false);
                setContextResetKey((prev) => prev + 1);
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Reiniciar visor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

useGLTF.preload(DEFAULT_MODEL_PATH);
