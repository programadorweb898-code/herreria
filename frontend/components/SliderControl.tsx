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
