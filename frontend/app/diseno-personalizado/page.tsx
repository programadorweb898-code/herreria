"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

import WhatsAppButton from "@/components/WhatsAppButton";
import { getProduct } from "@/data/products";
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

function SliderControl({
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
  return (
    <label className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-light uppercase tracking-[0.24em] text-accent">
          {label}
        </span>
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
          {Math.round(value)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none bg-slate-200 accent-foreground"
      />
    </label>
  );
}

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

  const initialWidth = useMemo(
    () => Number(searchParams.get("width")) || 100,
    [searchParams]
  );
  const initialHeight = useMemo(
    () => Number(searchParams.get("height")) || 100,
    [searchParams]
  );
  const initialDepth = useMemo(
    () => Number(searchParams.get("depth")) || 30,
    [searchParams]
  );

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [depth, setDepth] = useState(initialDepth);

  useEffect(() => {
    if (productSlug) {
      void getProduct(productSlug).then((p) => {
        if (p) {
          setProduct(p);
          // Solo actualizamos si no vienen por URL para no pisar el link del producto
          if (!searchParams.get("width")) setWidth(p.width || 100);
          if (!searchParams.get("height")) setHeight(p.height || 100);
          if (!searchParams.get("depth")) setDepth(p.depth || 30);
        }
      });
    }
  }, [productSlug, searchParams]);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-32 sm:px-8 sm:pb-24 lg:px-12">
      <section className="mb-10 grid gap-px border border-border bg-border lg:grid-cols-[1.6fr_1fr]">
        <div className="bg-white p-6 sm:p-8 flex flex-col gap-6">
          <div className="relative group">
            <EstanteViewer 
              width={width / 100} 
              height={height / 100} 
              depth={depth / 100} 
              modelPath={product?.modelPath}
            />
            {product?.image && (
              <div className="absolute top-4 right-4 w-32 h-32 md:w-48 md:h-48 border-2 border-white shadow-xl overflow-hidden z-10 transition-transform hover:scale-105">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] uppercase tracking-widest p-1 text-center">
                  Referencia Real
                </div>
              </div>
            )}
          </div>
          {product && (
            <div className="bg-slate-50 p-4 border-l-4 border-foreground">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">Modelo Seleccionado</p>
              <p className="text-sm font-medium">{product.name}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-8 bg-white px-6 py-8 sm:px-8 sm:py-10">
          <div className="space-y-3">
            <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">
              Visor interactivo
            </p>
            <h2 className="text-3xl font-semibold uppercase tracking-tight">
              Ajustá el estante en tiempo real.
            </h2>
            <p className="text-sm font-light leading-7 text-slate-600">
              Explorá proporciones antes de pedir tu pieza y usá estos valores como referencia para
              tu diseño personalizado.
            </p>
          </div>

          <div className="space-y-6">
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
            <div className="grid grid-cols-[1fr_100px] gap-4">
              <SliderControl
                label="Alto"
                value={height}
                min={10}
                max={250}
                step={1}
                onChange={setHeight}
              />
              <NumberInput
                label=""
                value={height}
                min={10}
                max={250}
                step={1}
                onChange={setHeight}
              />
            </div>
            <div className="grid grid-cols-[1fr_100px] gap-4">
              <SliderControl
                label="Profundidad"
                value={depth}
                min={10}
                max={100}
                step={1}
                onChange={setDepth}
              />
              <NumberInput
                label=""
                value={depth}
                min={10}
                max={100}
                step={1}
                onChange={setDepth}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-8 border border-border px-8 py-16 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">Diseño personalizado</p>
        <h1 className="max-w-3xl text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
          Crea tu pieza única a medida.
        </h1>

        <WhatsAppButton className="px-8 py-4" message={message} phone={phone}>
          Solicitar diseño
        </WhatsAppButton>

        <p className="max-w-2xl mt-8 text-base font-light leading-8 text-slate-600">
          Trabajamos con vos para diseñar y fabricar muebles y objetos metálicos que se adapten
          perfectamente a tus necesidades y espacios. Desde materiales hasta dimensiones y acabados.
        </p>
      </div>

      <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Proceso</p>
          <p className="text-base font-light leading-8 text-slate-600">
            De lo conceptual a lo real. Asesoramiento completo desde la idea hasta la entrega final.
          </p>
        </div>
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Materiales</p>
          <p className="text-base font-light leading-8 text-slate-600">
            Hierro, acero, madera y acabados a tu elección. Calidad y precisión garantizadas.
          </p>
        </div>
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Tiempos</p>
          <p className="text-base font-light leading-8 text-slate-600">
            Cotización según proyecto. Fabricación y entrega con cronograma acordado.
          </p>
        </div>
      </div>
    </div>
  );
}
