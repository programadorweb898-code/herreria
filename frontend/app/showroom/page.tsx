"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import SliderControl from "@/components/SliderControl";
import { getProducts } from "@/data/products";
import type { CameraState } from "@/components/ProfessionalViewer";
import type { Product } from "@/types/product";

const ProfessionalViewer = dynamic(() => import("@/components/ProfessionalViewer"), { ssr: false });

const WOOD_TYPES = [
  { id: "roble", name: "Roble", color: "#8B6914", roughness: 0.8, multiplier: 1.0 },
  { id: "pino", name: "Pino", color: "#C4A35A", roughness: 0.7, multiplier: 0.8 },
  { id: "cerezo", name: "Cerezo", color: "#6B2D0E", roughness: 0.75, multiplier: 1.2 },
  { id: "nogal", name: "Nogal", color: "#3D1F0D", roughness: 0.7, multiplier: 1.3 },
  { id: "natural", name: "Natural", color: "#D4A574", roughness: 0.9, multiplier: 0.9 },
  { id: "ebano", name: "Ebano", color: "#1A0A00", roughness: 0.6, multiplier: 1.5 },
] as const;

type WoodType = typeof WOOD_TYPES[number];

function ShowroomContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productConfigs, setProductConfigs] = useState<
    Record<
      string,
      {
        width: number;
        height: number;
        depth: number;
        wood: WoodType;
        cameraState?: CameraState;
      }
    >
  >({});
  const [viewerKey, setViewerKey] = useState<number>(0);

  const calculatePrice = () => {
    if (!selectedProduct || !productConfigs[selectedProduct._id]) return 0;
    const config = productConfigs[selectedProduct._id];

    const baseW = selectedProduct.width || 100;
    const baseH = selectedProduct.height || 180;
    const baseD = selectedProduct.depth || 30;
    const basePrice = selectedProduct.price || 0;
    const scaleFactor = (config.width * config.height * config.depth) / (baseW * baseH * baseD);
    const woodMultiplier = config.wood?.multiplier || 1.0;

    return Math.round(basePrice * scaleFactor * woodMultiplier);
  };

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(calculatePrice());

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);

      if (data.length > 0) {
        const productFromUrl = productSlug ? data.find((p) => p.slug === productSlug) : null;
        const initialProduct = productFromUrl || data[0];
        setSelectedProduct(initialProduct);

        const saved = localStorage.getItem("showroom_configs");
        const savedConfigs = saved ? JSON.parse(saved) : {};
        const initialConfigs: typeof productConfigs = {};

        data.forEach((p) => {
          const savedConfig = savedConfigs[p._id];
          let currentWood: WoodType = WOOD_TYPES[0];

          if (savedConfig?.wood?.id) {
            const found = WOOD_TYPES.find((w) => w.id === savedConfig.wood.id);
            if (found) currentWood = found;
          }

          const isSelectedFromUrl = productFromUrl && p.slug === productSlug;
          const urlWidth = isSelectedFromUrl ? Number(searchParams.get("width")) : null;
          const urlHeight = isSelectedFromUrl ? Number(searchParams.get("height")) : null;
          const urlDepth = isSelectedFromUrl ? Number(searchParams.get("depth")) : null;
          const isBodegaMilan = p.slug === "estanteria-pared-lineal";

          initialConfigs[p._id] = {
            width: urlWidth || savedConfig?.width || (isBodegaMilan ? 35 : (p.width || 100)),
            height: urlHeight || savedConfig?.height || (p.height || 180),
            depth: urlDepth || savedConfig?.depth || (p.depth || 30),
            wood: currentWood,
            cameraState: savedConfig?.cameraState,
          };
        });

        setProductConfigs(initialConfigs);
        setViewerKey(Date.now());
      }
    }

    loadProducts();
  }, [productSlug, searchParams]);

  useEffect(() => {
    if (Object.keys(productConfigs).length > 0) {
      localStorage.setItem("showroom_configs", JSON.stringify(productConfigs));
    }
  }, [productConfigs]);

  if (!selectedProduct || !productConfigs[selectedProduct._id]) return null;

  const currentConfig = productConfigs[selectedProduct._id];

  const updateConfig = (updates: Partial<typeof currentConfig>) => {
    setProductConfigs((prev) => ({
      ...prev,
      [selectedProduct._id]: { ...prev[selectedProduct._id], ...updates },
    }));
  };

  const handleReset = () => {
    updateConfig({
      width: selectedProduct.width || 100,
      height: selectedProduct.height || 180,
      depth: selectedProduct.depth || 30,
      wood: WOOD_TYPES[0],
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 text-neutral-500 transition-colors hover:text-emerald-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-[0.3em]">Volver</span>
        </Link>

        <header className="mb-12">
          <h1 className="mb-4 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            3D Tech Showroom
          </h1>
        </header>

        <section className="rounded-[28px] border border-white/5 bg-neutral-900/90 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] sm:p-6 lg:p-7">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/5 bg-neutral-950/70 p-2 sm:h-[360px] lg:h-[400px]">
                    <ProfessionalViewer
                      key={viewerKey}
                      modelUrl={selectedProduct.modelPath || ""}
                      width={currentConfig.width}
                      height={currentConfig.height}
                      depth={currentConfig.depth}
                      woodConfig={currentConfig.wood}
                      cameraState={currentConfig.cameraState}
                      onCameraChange={(state: CameraState) => updateConfig({ cameraState: state })}
                      onReset={handleReset}
                    onMeshesLoaded={() => {}}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-neutral-950/50 p-3 sm:p-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                      Seleccion de piezas
                    </p>
                    <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1 snap-x">
                      {products.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => setSelectedProduct(p)}
                          className={`relative flex h-20 w-20 flex-shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-all sm:h-24 sm:w-24 ${
                            selectedProduct._id === p._id
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className={`object-cover transition-all duration-500 ${
                              selectedProduct._id === p._id ? "scale-110 grayscale-0" : "grayscale"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <p className="text-xs text-neutral-500">Producto: {selectedProduct.name}</p>
                      <p className="mt-2 text-xs italic leading-5 text-neutral-400">
                        &quot;{selectedProduct.description}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <aside className="max-h-[520px] overflow-y-auto rounded-2xl border border-white/5 bg-neutral-950/55 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-400">
                        Diseno personalizado
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-white">
                        Configura tu pieza
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300 transition hover:border-white/20 hover:text-white"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-6 pt-5">
                    <div className="rounded-2xl border border-white/5 bg-neutral-950/60 p-4">
                      <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            Precio estimado
                          </h3>
                          <p className="text-2xl font-semibold tabular-nums text-white sm:text-3xl">
                            {formattedPrice}
                          </p>
                        </div>
                        <p className="max-w-[120px] text-right text-[8px] uppercase tracking-tighter text-neutral-500">
                          Sujeto a cambios segun materiales
                        </p>
                      </div>

                    </div>

                    <div className="space-y-5">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                        Ajustar medidas
                      </h3>
                      <div className="grid grid-cols-1 gap-5">
                        <SliderControl
                          label="Ancho"
                          value={currentConfig.width}
                          min={10}
                          max={250}
                          onChange={(v) => updateConfig({ width: v })}
                          step={1}
                        />
                        <SliderControl
                          label="Alto"
                          value={currentConfig.height}
                          min={10}
                          max={250}
                          onChange={(v) => updateConfig({ height: v })}
                          step={1}
                        />
                        <SliderControl
                          label="Profundidad"
                          value={currentConfig.depth}
                          min={10}
                          max={200}
                          onChange={(v) => updateConfig({ depth: v })}
                          step={1}
                        />
                      </div>
                    </div>

                    {selectedProduct.hasWood && (
                      <div className="space-y-4 border-t border-white/5 pt-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                          Tipo de madera
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {WOOD_TYPES.map((wood: WoodType) => (
                            <button
                              key={wood.id}
                              onClick={() => updateConfig({ wood })}
                              className={`flex items-center gap-2 rounded-xl border px-3 py-3 transition-all ${
                                currentConfig.wood.id === wood.id
                                  ? "border-emerald-500 bg-emerald-500/10 text-white"
                                  : "border-white/5 bg-neutral-950/50 text-neutral-300 hover:border-white/20"
                              }`}
                            >
                              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: wood.color }} />
                              <span className="text-xs font-bold uppercase tracking-tight">{wood.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </div>

          </div>
        </section>
      </div>

      <section className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-4 text-xs font-light uppercase tracking-[0.28em] text-emerald-400">
            Diseno personalizado
          </p>
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">Queres tu pieza unica a medida?</h2>
          <p className="mx-auto mb-10 max-w-2xl leading-8 text-neutral-400">
            Trabajamos con vos para disenar y fabricar muebles y objetos metalicos que
            se adapten perfectamente a tus necesidades y espacios.
          </p>
          <a
            href="https://wa.me/5491155606321?text=Hola%21%20Me%20interesa%20solicitar%20un%20diseno%20personalizado%20basado%20en%20el%20showroom."
            className="inline-block rounded-lg bg-emerald-500 px-8 py-4 font-bold text-black transition-colors hover:bg-emerald-600"
          >
            Solicitar diseno
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Proceso</p>
          <p className="text-sm leading-7 text-neutral-400">
            De lo conceptual a lo real. Asesoramiento completo desde la idea hasta la
            entrega final.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Materiales</p>
          <p className="text-sm leading-7 text-neutral-400">
            Hierro, acero, madera y acabados a tu eleccion. Calidad y precision
            garantizadas.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-neutral-900 p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Tiempos</p>
          <p className="text-sm leading-7 text-neutral-400">
            Cotizacion segun proyecto. Fabricacion y entrega con cronograma acordado.
          </p>
        </div>
      </section>

    </main>
  );
}

export default function ShowroomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
          Cargando Showroom...
        </div>
      }
    >
      <ShowroomContent />
    </Suspense>
  );
}
