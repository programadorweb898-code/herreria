"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

import WhatsAppButton from "@/components/WhatsAppButton";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";

const EstanteViewer = dynamic(() => import("@/components/EstanteViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center bg-slate-100 text-sm uppercase tracking-[0.2em] text-slate-500">
      Cargando visor 3D
    </div>
  ),
});

const phone = "+5491167894523";
const message = "Hola! Me interesa solicitar un diseño personalizado.";

// Slugs de productos con comportamiento especial
const BODEGA_MILAN_SLUG = "estanteria-pared-lineal";
const BANQUETA_CALI_SLUG = "estanteria-acero-geometrico";

import SliderControl from "@/components/SliderControl";

function NumberInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "cm",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-light uppercase tracking-[0.24em] text-accent">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full border border-border bg-white px-3 py-2 text-sm uppercase tracking-[0.16em] text-foreground"
        />
        <span className="text-xs font-light uppercase tracking-[0.16em] text-slate-500">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function DisenoPersonalizadoPage() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const initialWidth = useMemo(() => {
    const w = searchParams.get("width");
    if (w) return Number(w);
    if (productSlug === BANQUETA_CALI_SLUG) return 30;
    if (productSlug === BODEGA_MILAN_SLUG) return 60;
    return 100;
  }, [searchParams, productSlug]);

  const initialHeight = useMemo(() => {
    const h = searchParams.get("height");
    if (h) {
      const val = Number(h);
      return productSlug === BODEGA_MILAN_SLUG ? val / 10 : val;
    }
    if (productSlug === BANQUETA_CALI_SLUG) return 75;
    if (productSlug === BODEGA_MILAN_SLUG) return 5; // 5 vinos por defecto (50cm / 10)
    return 100;
  }, [searchParams, productSlug]);

  const initialDepth = useMemo(() => {
    const d = searchParams.get("depth");
    if (d) return Number(d);
    if (productSlug === BANQUETA_CALI_SLUG) return 30;
    if (productSlug === BODEGA_MILAN_SLUG) return 15;
    return 30;
  }, [searchParams, productSlug]);

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [depth, setDepth] = useState(initialDepth);

  useEffect(() => {
    void getProducts().then((products) => {
      const productsWithModel = products.filter(p => p.modelPath);
      setAllProducts(productsWithModel);
      
      if (productSlug) {
        const current = productsWithModel.find(p => p.slug === productSlug);
        if (current) {
          setProduct(current);
          if (!searchParams.get("width")) setWidth(current.width || 100);
          
          if (!searchParams.get("height")) {
            const h = current.height || 100;
            setHeight(current.slug === BODEGA_MILAN_SLUG ? h / 10 : h);
          } else {
            const h = Number(searchParams.get("height"));
            setHeight(current.slug === BODEGA_MILAN_SLUG ? h / 10 : h);
          }

          if (!searchParams.get("depth")) setDepth(current.depth || 30);
        }
      } else if (productsWithModel.length > 0) {
        const first = productsWithModel[0];
        setProduct(first);
        setWidth(first.width || 100);
        const h = first.height || 100;
        setHeight(first.slug === BODEGA_MILAN_SLUG ? h / 10 : h);
        setDepth(first.depth || 30);
      }
    });
  }, [productSlug, searchParams]);

  const handleProductChange = (newProduct: Product) => {
    setProduct(newProduct);
    setWidth(newProduct.width || 100);
    const h = newProduct.height || 100;
    setHeight(newProduct.slug === BODEGA_MILAN_SLUG ? h / 10 : h);
    setDepth(newProduct.depth || 30);
    
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("product", newProduct.slug);
    window.history.pushState({}, "", newUrl.toString());
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-20 sm:px-6 md:pt-24 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="mb-4 text-xs font-light uppercase tracking-[0.4em] text-emerald-400">
          Experiencia Interactiva
        </p>
        <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-5xl md:text-6xl text-white">
          Diseño Personalizado
        </h1>
        <div className="mt-6 h-px w-24 bg-emerald-500/20" />
      </div>

      <section className="mb-10 grid gap-px border border-white/5 bg-white/5 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.4fr_1fr] overflow-hidden">
        <div className="bg-neutral-900 p-4 sm:p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
          <div className="relative group w-full">
            <EstanteViewer 
              width={width / 100} 
              height={product?.slug === BODEGA_MILAN_SLUG ? (height * 10) / 100 : height / 100} 
              depth={depth / 100} 
              modelPath={product?.modelPath}
              productSlug={product?.slug}
            />
            {product?.image && (
              <div className="absolute top-4 right-4 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-white/10 shadow-2xl overflow-hidden z-10 transition-transform hover:scale-105">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[7px] uppercase tracking-widest p-1 text-center">
                  Referencia Real
                </div>
              </div>
            )}
          </div>

          {/* Selector de productos */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Cambiar producto 3D</p>
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
              {allProducts.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleProductChange(p)}
                  className={`relative flex-shrink-0 w-20 h-20 border-2 transition-all duration-300 ${
                    product?.slug === p.slug 
                      ? "border-emerald-500 scale-105 shadow-lg z-10" 
                      : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <Image 
                    src={p.image || ""} 
                    alt={p.name} 
                    fill 
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {product && (
            <div className="bg-neutral-800 p-4 border-l-4 border-emerald-500">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 mb-1">Modelo Seleccionado</p>
              <p className="text-sm font-medium text-white">{product.name}</p>
            </div>
          )}
        </div>

        <div className="bg-neutral-900 p-4 sm:p-6 md:p-8 flex flex-col border-l border-white/5">
          <div className="h-[350px] sm:h-[400px] md:h-[500px] overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-8">
            <div className="space-y-3">
              <p className="text-xs font-light uppercase tracking-[0.28em] text-emerald-400">
                Visor interactivo
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-white">
                Ajustá el estante en tiempo real.
              </h2>
              <p className="text-sm font-light leading-7 text-neutral-400">
                Explorá proporciones antes de pedir tu pieza y usá estos valores como referencia para
                tu diseño personalizado.
              </p>
            </div>

            <div className="space-y-6">
              {/* Solo mostrar Ancho y Profundidad si no es Bodega o Banqueta */}
              {product?.slug !== BODEGA_MILAN_SLUG && product?.slug !== BANQUETA_CALI_SLUG && (
                <div className="grid grid-cols-[1fr_100px] gap-4">
                  <SliderControl
                    label="Ancho"
                    value={width}
                    min={10}
                    max={250}
                    step={1}
                    onChange={setWidth}
                  />
                  <NumberInput
                    label=""
                    value={width}
                    min={10}
                    max={250}
                    step={1}
                    onChange={setWidth}
                  />
                </div>
              )}

              <div className="grid grid-cols-[1fr_100px] gap-4">
                <SliderControl
                  label={product?.slug === BODEGA_MILAN_SLUG ? "Cantidad de Vinos" : "Alto"}
                  value={height}
                  min={product?.slug === BODEGA_MILAN_SLUG ? 1 : 10}
                  max={product?.slug === BODEGA_MILAN_SLUG ? 20 : 250}
                  step={1}
                  onChange={setHeight}
                  unit={product?.slug === BODEGA_MILAN_SLUG ? "vinos" : "cm"}
                />
                <NumberInput
                  label=""
                  value={height}
                  min={product?.slug === BODEGA_MILAN_SLUG ? 1 : 10}
                  max={product?.slug === BODEGA_MILAN_SLUG ? 20 : 250}
                  step={1}
                  onChange={setHeight}
                  unit={product?.slug === BODEGA_MILAN_SLUG ? "vinos" : "cm"}
                />
              </div>

              {product?.slug !== BODEGA_MILAN_SLUG && product?.slug !== BANQUETA_CALI_SLUG && (
                <div className="grid grid-cols-[1fr_100px] gap-4">
                  <SliderControl
                    label="Profundidad"
                    value={depth}
                    min={10}
                    max={200}
                    step={1}
                    onChange={setDepth}
                  />
                  <NumberInput
                    label=""
                    value={depth}
                    min={10}
                    max={200}
                    step={1}
                    onChange={setDepth}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 bg-neutral-900" />
        </div>
      </section>

      <div className="flex flex-col items-center gap-8 border border-white/5 bg-neutral-900 px-8 py-16 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-light uppercase tracking-[0.28em] text-emerald-400">Diseño personalizado</p>
        <h1 className="max-w-3xl text-4xl font-semibold uppercase tracking-tight sm:text-5xl text-white">
          Crea tu pieza única a medida.
        </h1>

        <WhatsAppButton className="px-8 py-4 bg-emerald-500 text-black font-bold hover:bg-emerald-600 transition-colors" message={message} phone={phone}>
          Solicitar diseño
        </WhatsAppButton>

        <p className="max-w-2xl mt-8 text-base font-light leading-8 text-neutral-400">
          Trabajamos con vos para diseñar y fabricar muebles y objetos metálicos que se adapten
          perfectamente a tus necesidades y espacios. Desde materiales hasta dimensiones y acabados.
        </p>
      </div>

      <div className="mt-10 grid gap-px border border-white/5 bg-white/5 md:grid-cols-3">
        <div className="bg-neutral-900 p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Proceso</p>
          <p className="text-base font-light leading-8 text-neutral-400">
            De lo conceptual a lo real. Asesoramiento completo desde la idea hasta la entrega final.
          </p>
        </div>
        <div className="bg-neutral-900 p-8 border-x border-white/5">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Materiales</p>
          <p className="text-base font-light leading-8 text-neutral-400">
            Hierro, acero, madera y acabados a tu elección. Calidad y precisión garantizadas.
          </p>
        </div>
        <div className="bg-neutral-900 p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-emerald-400">Tiempos</p>
          <p className="text-base font-light leading-8 text-neutral-400">
            Cotización según proyecto. Fabricación y entrega con cronograma acordado.
          </p>
        </div>
      </div>
    </div>
  );
}
