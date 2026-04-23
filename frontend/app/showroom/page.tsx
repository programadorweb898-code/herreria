"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import type { CameraState } from "@/components/ProfessionalViewer";

const ProfessionalViewer = dynamic(() => import("@/components/ProfessionalViewer"), { ssr: false });


function SliderControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block space-y-2">
      <div className="flex justify-between text-xs text-neutral-400 uppercase tracking-widest">
        <span>{label}</span>
        <span>{value} cm</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1 bg-neutral-800 accent-emerald-500 appearance-none cursor-pointer" />
    </label>
  );
}

const WOOD_TYPES = [
  { id: 'paraiso', name: 'Paraíso', color: '#d2b48c', roughness: 0.6 },
  { id: 'petiribi', name: 'Petiribí', color: '#8b5a2b', roughness: 0.4 },
  { id: 'nogal', name: 'Nogal', color: '#3d2b1f', roughness: 0.3 },
  { id: 'roble', name: 'Roble', color: '#b58b5c', roughness: 0.5 },
];

export default function ShowroomPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [productConfigs, setProductConfigs] = useState<Record<string, {
    width: number;
    height: number;
    depth: number;
    wood: typeof WOOD_TYPES[0];
    cameraState?: CameraState;
  }>>({});

  // 1. Cargar productos e inicializar configuraciones
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
        
        // Intentar cargar desde LocalStorage
        const saved = localStorage.getItem('showroom_configs');
        const savedConfigs = saved ? JSON.parse(saved) : {};

        const initialConfigs: typeof productConfigs = {};
        data.forEach(p => {
          // Prioridad: 1. Lo guardado en LocalStorage, 2. Los defaults del producto
          // Caso especial: Bodega Milán en showroom por defecto 35cm
          const isBodegaMilan = p.slug === 'estanteria-pared-lineal';
          
          initialConfigs[p._id] = savedConfigs[p._id] || {
            width: isBodegaMilan ? 35 : (p.width || 100),
            height: p.height || 180,
            depth: p.depth || 30,
            wood: WOOD_TYPES[0]
          };
        });
        setProductConfigs(initialConfigs);
      }
    }
    loadProducts();
  }, []);

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
      
      <div className="max-w-7xl mx-auto px-4 py-20">
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
        key={selectedProduct._id}
        modelUrl={selectedProduct.modelPath || ""} 
        width={currentConfig.width}
        height={currentConfig.height}
        depth={currentConfig.depth}
        woodConfig={currentConfig.wood}
        cameraState={currentConfig.cameraState}
        onCameraChange={(state: CameraState) => updateConfig({ cameraState: state })}
        onReset={handleReset}
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
    <div className="lg:hidden bg-neutral-900 p-4 rounded-2xl border border-white/5 grid grid-cols-3 gap-4">
      <div className="col-span-1">
         <SliderControl label="Ancho" value={currentConfig.width} min={10} max={250} onChange={(v) => updateConfig({ width: v })} />
      </div>
      <div className="col-span-1">
         <SliderControl label="Alto" value={currentConfig.height} min={10} max={250} onChange={(v) => updateConfig({ height: v })} />
      </div>
      <div className="col-span-1">
         <SliderControl label="Prof" value={currentConfig.depth} min={10} max={100} onChange={(v) => updateConfig({ depth: v })} />
      </div>
    </div>
  </div>

          <aside className="hidden lg:block space-y-6">
            <div className="bg-neutral-900 p-6 rounded-2xl border border-white/5 space-y-8">
              <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Ajustar Medidas</h3>
              <SliderControl label="Ancho" value={currentConfig.width} min={10} max={250} onChange={(v) => updateConfig({ width: v })} />
              <SliderControl label="Alto" value={currentConfig.height} min={10} max={250} onChange={(v) => updateConfig({ height: v })} />
              <SliderControl label="Profundidad" value={currentConfig.depth} min={10} max={100} onChange={(v) => updateConfig({ depth: v })} />
              
              <div className="pt-6 border-t border-white/5 space-y-4">
                <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Tipo de Madera</h3>
                <div className="grid grid-cols-2 gap-2">
                  {WOOD_TYPES.map((wood) => (
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

              <div className="pt-6 border-t border-white/5 space-y-2">
                 <p className="text-neutral-500 text-xs">Producto: {selectedProduct.name}</p>
                 <p className="text-neutral-400 text-xs italic">&quot;{selectedProduct.description}&quot;</p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* ... contenido existente ... */}
      </div>

      {/* Bloque CTA */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-light uppercase tracking-[0.28em] text-emerald-400 mb-4">Diseño personalizado</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">¿Querés tu pieza única a medida?</h2>
          <p className="text-neutral-400 leading-8 mb-10 max-w-2xl mx-auto">
            Trabajamos con vos para diseñar y fabricar muebles y objetos metálicos que se adapten perfectamente a tus necesidades y espacios.
          </p>
          <a href={`https://wa.me/5491167894523?text=Hola! Me interesa solicitar un diseño personalizado basado en el showroom.`} className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-4 rounded-lg transition-colors">
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

    </main>
  );
}
