"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import WhatsAppButton from "@/components/WhatsAppButton";

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
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-light uppercase tracking-[0.24em] text-accent">
          {label}
        </span>
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
          {Math.round(value * 100)} cm
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

export default function DisenoPersonalizadoPage() {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [depth, setDepth] = useState(1);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-32 sm:px-8 sm:pb-24 lg:px-12">
      <section className="mb-10 grid gap-px border border-border bg-border lg:grid-cols-[1.6fr_1fr]">
        <div className="bg-white p-4 sm:p-6">
          <EstanteViewer width={width} height={height} depth={depth} />
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
            <SliderControl
              label="Ancho"
              value={width}
              min={0.5}
              max={2}
              step={0.1}
              onChange={setWidth}
            />
            <SliderControl
              label="Alto"
              value={height}
              min={0.5}
              max={2}
              step={0.1}
              onChange={setHeight}
            />
            <SliderControl
              label="Profundidad"
              value={depth}
              min={0.5}
              max={2}
              step={0.1}
              onChange={setDepth}
            />
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
