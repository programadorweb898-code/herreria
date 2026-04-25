// frontend/components/SliderControl.tsx
import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}

export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "cm",
}: SliderControlProps) {
  return (
    <label className="space-y-3 block">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-400">
          {label}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-white">
          {Math.round(value)} {unit}
        </span>
      </div>
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none bg-white/10 accent-emerald-500 hover:accent-emerald-400 transition-all rounded-full"
        />
        <div className="flex justify-between mt-2">
          <span className="text-[9px] font-medium uppercase tracking-widest text-neutral-500">{min}{unit}</span>
          <span className="text-[9px] font-medium uppercase tracking-widest text-neutral-500">Máx: {max}{unit}</span>
        </div>
      </div>
    </label>
  );
}
