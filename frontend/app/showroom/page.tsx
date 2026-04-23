"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";

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

export default function ShowroomPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(180);
  const [depth, setDepth] = useState(30);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
        setWidth(data[0].width || 100);
        setHeight(data[0].height || 180);
        setDepth(data[0].depth || 30);
      }
    }
    loadProducts();
  }, []);

  if (!selectedProduct) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            3D Tech Showroom
          </h1>
        </header>
<section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
  <div className="space-y-4">
    {/* Visor 3D: altura reducida en móviles para dejar espacio */}
    <div className="bg-neutral-900 rounded-2xl p-2 border border-white/5 h-[300px] sm:h-[400px]">
      <ProfessionalViewer modelUrl={selectedProduct.modelPath || ""} />    </div>

    {/* Miniaturas compactas */}
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {products.map((p) => (
        <button
          key={p._id}
          onClick={() => {
            setSelectedProduct(p);
            setWidth(p.width || 100);
            setHeight(p.height || 180);
            setDepth(p.depth || 30);
          }}
          className={`aspect-square rounded-lg border-2 transition-all p-1 ${selectedProduct._id === p._id ? 'border-emerald-500' : 'border-white/10'}`}
        >
          <span className="text-[9px] uppercase font-bold truncate block">{p.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>

    {/* Controles compactos para móviles */}
    <div className="lg:hidden bg-neutral-900 p-4 rounded-2xl border border-white/5 grid grid-cols-3 gap-4">
      <div className="col-span-1">
         <SliderControl label="Ancho" value={width} min={10} max={250} onChange={setWidth} />
      </div>
      <div className="col-span-1">
         <SliderControl label="Alto" value={height} min={10} max={250} onChange={setHeight} />
      </div>
      <div className="col-span-1">
         <SliderControl label="Prof" value={depth} min={10} max={100} onChange={setDepth} />
      </div>
    </div>
  </div>

          <aside className="hidden lg:block space-y-6">
            <div className="bg-neutral-900 p-6 rounded-2xl border border-white/5 space-y-8">
              <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Ajustar Medidas</h3>
              <SliderControl label="Ancho" value={width} min={10} max={250} onChange={setWidth} />
              <SliderControl label="Alto" value={height} min={10} max={250} onChange={setHeight} />
              <SliderControl label="Profundidad" value={depth} min={10} max={100} onChange={setDepth} />
              
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
