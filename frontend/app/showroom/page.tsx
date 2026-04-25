"use client";

import { Suspense, useState, useEffect } from 'react';
import SliderControl from "@/components/SliderControl";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import type { CameraState } from "@/components/ProfessionalViewer";

const ProfessionalViewer = dynamic(() => import("@/components/ProfessionalViewer"), { ssr: false });
const WOOD_TYPES = [
  { id: 'roble',   name: 'Roble',   color: '#8B6914', roughness: 0.8, multiplier: 1.0 },
  { id: 'pino',    name: 'Pino',    color: '#C4A35A', roughness: 0.7, multiplier: 0.8 },
  { id: 'cerezo',  name: 'Cerezo',  color: '#6B2D0E', roughness: 0.75, multiplier: 1.2 },
  { id: 'nogal',   name: 'Nogal',   color: '#3D1F0D', roughness: 0.7, multiplier: 1.3 },
  { id: 'natural', name: 'Natural', color: '#D4A574', roughness: 0.9, multiplier: 0.9 },
  { id: 'ebano',   name: 'Ébano',   color: '#1A0A00', roughness: 0.6, multiplier: 1.5 },
] as const;
type WoodType = typeof WOOD_TYPES[number];

function ShowroomContent() {
    const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [meshNames, setMeshNames] = useState<string[]>([]);
  
  const [productConfigs, setProductConfigs] = useState<Record<string, {
    width: number;
    height: number;
    depth: number;
    wood: WoodType;
    cameraState?: CameraState;
  }>>({});
  
  const [viewerKey, setViewerKey] = useState<number>(0); 

  // Cálculo de precio dinámico
  const calculatePrice = () => {
    if (!selectedProduct || !productConfigs[selectedProduct._id]) return 0;
    const config = productConfigs[selectedProduct._id];
    
    // Dimensiones base del producto (o defaults si no tiene)
    const baseW = selectedProduct.width || 100;
    const baseH = selectedProduct.height || 180;
    const baseD = selectedProduct.depth || 30;
    const basePrice = selectedProduct.price || 0;

    // Calculamos el factor de escala volumétrico
    const scaleFactor = (config.width * config.height * config.depth) / (baseW * baseH * baseD);
    
    // Aplicamos el multiplicador de madera (con fallback de 1.0 por seguridad)
    const woodMultiplier = config.wood?.multiplier || 1.0;

    return Math.round(basePrice * scaleFactor * woodMultiplier);
  };

  const currentPrice = calculatePrice();
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(currentPrice);

  // 1. Cargar productos e inicializar configuraciones
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      if (data.length > 0) {
        // Seleccionar producto por slug o el primero
        const productFromUrl = productSlug ? data.find(p => p.slug === productSlug) : null;
        const initialProduct = productFromUrl || data[0];
        setSelectedProduct(initialProduct);
        
        // Intentar cargar desde LocalStorage
        const saved = localStorage.getItem('showroom_configs');
        const savedConfigs = saved ? JSON.parse(saved) : {};

        const initialConfigs: typeof productConfigs = {};
        data.forEach(p => {
          const savedConfig = savedConfigs[p._id];
          
          // Asegurarnos de que el objeto de madera tenga todas las propiedades actuales (como multiplier)
          let currentWood: WoodType = WOOD_TYPES[0];
          if (savedConfig?.wood?.id) {
            const found = WOOD_TYPES.find(w => w.id === savedConfig.wood.id);
            if (found) currentWood = found;
          }

          // Si es el producto de la URL, tomar dimensiones de URL si existen
          const isSelectedFromUrl = productFromUrl && p.slug === productSlug;
          
          const urlWidth = isSelectedFromUrl ? Number(searchParams.get("width")) : null;
          const urlHeight = isSelectedFromUrl ? Number(searchParams.get("height")) : null;
          const urlDepth = isSelectedFromUrl ? Number(searchParams.get("depth")) : null;

          const isBodegaMilan = p.slug === 'estanteria-pared-lineal';
          
          initialConfigs[p._id] = {
            width: urlWidth || savedConfig?.width || (isBodegaMilan ? 35 : (p.width || 100)),
            height: urlHeight || savedConfig?.height || (p.height || 180),
            depth: urlDepth || savedConfig?.depth || (p.depth || 30),
            wood: currentWood,
            cameraState: savedConfig?.cameraState
          };
        });
        setProductConfigs(initialConfigs);
        setViewerKey(Date.now()); // Set initial key
      }
    }
    loadProducts();
  }, [productSlug, searchParams]);

  // 2. Guardar en LocalStorage cada vez que cambien las configuraciones
  useEffect(() => {
    if (Object.keys(productConfigs).length > 0) {
      localStorage.setItem('showroom_configs', JSON.stringify(productConfigs));
    }
  }, [productConfigs]);

  if (!selectedProduct || !productConfigs[selectedProduct._id]) return null;

  // Helpers para obtener y setear valores del producto actual
  const currentConfig = productConfigs[selectedProduct._id];

  const updateConfig = (updates: Partial<typeof currentConfig>) => {
    setProductConfigs(prev => ({
      ...prev,
      [selectedProduct._id]: { ...prev[selectedProduct._id], ...updates }
    }));
  };

  const handleReset = () => {
    updateConfig({
      width: selectedProduct.width || 100,
      height: selectedProduct.height || 180,
      depth: selectedProduct.depth || 30,
      wood: WOOD_TYPES[0]
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-emerald-400 transition-colors mb-12 group"
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
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="text-xs font-bold uppercase tracking-[0.3em]">Volver</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            3D Tech Showroom
          </h1>
        </header>
<section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
  <div className="space-y-4 overflow-hidden">
    {/* Visor 3D */}
    <div className="relative bg-neutral-900 rounded-2xl p-2 border border-white/5 h-[400px] sm:h-[600px] overflow-hidden">
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
        onMeshesLoaded={setMeshNames}
      />
    </div>

    {/* Miniaturas */}
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {products.map((p) => (
        <button
          key={p._id}
          onClick={() => setSelectedProduct(p)}
          className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 transition-all overflow-hidden snap-start ${selectedProduct._id === p._id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/30'}`}
        >
          <Image 
            src={p.image} 
            alt={p.name}
            fill
            className={`object-cover transition-all duration-500 ${selectedProduct._id === p._id ? 'grayscale-0 scale-110' : 'grayscale'}`}
          />
        </button>
      ))}
    </div>

    {/* Controles móviles */}
    <div className="lg:hidden space-y-4">
      <div className="bg-neutral-900 p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Precio Estimado</h3>
            <p className="text-2xl font-semibold tabular-nums text-white">{formattedPrice}</p>
          </div>
          <p className="text-[8px] text-neutral-500 uppercase tracking-tighter mb-1 text-right">Sujeto a cambios según materiales</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div className="col-span-1">
             <SliderControl label="Ancho" value={currentConfig.width} min={10} max={250} onChange={(v) => updateConfig({ width: v })} step={1} />
          </div>
          <div className="col-span-1">
             <SliderControl label="Alto" value={currentConfig.height} min={10} max={250} onChange={(v) => updateConfig({ height: v })} step={1} />
          </div>
          <div className="col-span-1">
             <SliderControl label="Prof" value={currentConfig.depth} min={10} max={200} onChange={(v) => updateConfig({ depth: v })} step={1} />
          </div>
        </div>
      </div>

      {selectedProduct.hasWood && (
        <div className="bg-neutral-900 p-4 rounded-2xl border border-white/5">
          <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-3">Tipo de Madera</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {WOOD_TYPES.map((wood: WoodType) => (
              <button
                key={wood.id}
                onClick={() => updateConfig({ wood })}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${currentConfig.wood.id === wood.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-neutral-950/50'}`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: wood.color }} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-300">{wood.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>

          <aside className="hidden lg:block space-y-6">
            <div className="bg-neutral-900 p-6 rounded-2xl border border-white/5 space-y-8">
              <div className="space-y-1">
                <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Precio Estimado</h3>
                <p className="text-3xl font-semibold tabular-nums text-white">{formattedPrice}</p>
                <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Sujeto a cambios según materiales</p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6">
                <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Ajustar Medidas</h3>
                <SliderControl label="Ancho" value={currentConfig.width} min={10} max={250} onChange={(v) => updateConfig({ width: v })} step={1} />
                <SliderControl label="Alto" value={currentConfig.height} min={10} max={250} onChange={(v) => updateConfig({ height: v })} step={1} />
                <SliderControl label="Profundidad" value={currentConfig.depth} min={10} max={200} onChange={(v) => updateConfig({ depth: v })} step={1} />
              </div>
              
              {selectedProduct.hasWood && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Tipo de Madera</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {WOOD_TYPES.map((wood: WoodType) => (
                      <button
                        key={wood.id}
                        onClick={() => updateConfig({ wood })}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${currentConfig.wood.id === wood.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 hover:border-white/20'}`}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: wood.color }} />
                        <span className="text-xs uppercase tracking-tighter">{wood.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-white/5 space-y-2">
                 <p className="text-neutral-500 text-xs">Producto: {selectedProduct.name}</p>
                 <p className="text-neutral-400 text-xs italic">&quot;{selectedProduct.description}&quot;</p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {/* Bloque CTA */}
      <section className="border-t border-white/5 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-light uppercase tracking-[0.28em] text-emerald-400 mb-4">Diseño personalizado</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">¿Querés tu pieza única a medida?</h2>
          <p className="text-neutral-400 leading-8 mb-10 max-w-2xl mx-auto">
            Trabajamos con vos para diseñar y fabricar muebles y objetos metálicos que se adapten perfectamente a tus necesidades y espacios.
          </p>
          <a href={`https://wa.me/5491155606321?text=Hola%21%20Me%20interesa%20solicitar%20un%20dise%C3%B1o%20personalizado%20basado%20en%20el%20showroom.`} className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-4 rounded-lg transition-colors">
            Solicitar diseño
          </a>
        </div>
      </section>

      {/* Bloque 3 columnas */}
      <section className="max-w-7xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-8">
        <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Proceso</p>
          <p className="text-sm text-neutral-400 leading-7">De lo conceptual a lo real. Asesoramiento completo desde la idea hasta la entrega final.</p>
        </div>
        <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Materiales</p>
          <p className="text-sm text-neutral-400 leading-7">Hierro, acero, madera y acabados a tu elección. Calidad y precisión garantizadas.</p>
        </div>
        <div className="bg-neutral-900 p-8 rounded-2xl border border-white/5">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Tiempos</p>
          <p className="text-sm text-neutral-400 leading-7">Cotización según proyecto. Fabricación y entrega con cronograma acordado.</p>
        </div>
      </section>

      {meshNames.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white text-xs p-4 z-50 max-h-56 overflow-y-auto border-t border-white/20">
          <p className="font-bold text-emerald-400 mb-2 uppercase tracking-widest">Meshes ({meshNames.length})</p>
          {meshNames.map((n, i) => (
            <div key={i} className="py-0.5 border-b border-white/10">{i + 1}. {n}</div>
          ))}
        </div>
      )}

    </main>
  );
}

export default function ShowroomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando Showroom...</div>}>
      <ShowroomContent />
    </Suspense>
  );
}
