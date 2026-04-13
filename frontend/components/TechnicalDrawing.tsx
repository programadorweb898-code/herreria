"use client";

interface TechnicalDrawingProps {
  design: {
    width: number;
    height: number;
    depth: number;
    complexity: number;
    material: string;
    description: string;
  };
}

export default function TechnicalDrawing({ design }: TechnicalDrawingProps) {
  // Escalamos las dimensiones para que se vean bien en pantalla
  const scale = 1.5;
  const width = design.width * scale;
  const height = design.height * scale;
  const depth = design.depth * scale;
  const padding = 40;

  return (
    <div className="overflow-x-auto bg-slate-50 p-6 rounded border border-slate-200">
      <svg
        width={width + padding * 2}
        height={height + padding * 2}
        className="min-w-full"
        viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
      >
        {/* Background */}
        <rect width={width + padding * 2} height={height + padding * 2} fill="white" />

        {/* Title */}
        <text
          x={padding + width / 2}
          y={20}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-900"
        >
          PLANO TÉCNICO - VISTA FRONTAL
        </text>

        {/* Front View - Rectangle */}
        <g id="front-view">
          <rect
            x={padding}
            y={padding + 20}
            width={width}
            height={height}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="stroke-slate-800"
          />

          {/* Horizontal dimension line */}
          <line
            x1={padding}
            y1={padding + height + 20}
            x2={padding + width}
            y2={padding + height + 20}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <line
            x1={padding}
            y1={padding + height + 15}
            x2={padding}
            y2={padding + height + 25}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <line
            x1={padding + width}
            y1={padding + height + 15}
            x2={padding + width}
            y2={padding + height + 25}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <text
            x={padding + width / 2}
            y={padding + height + 45}
            textAnchor="middle"
            className="text-xs fill-slate-700 font-semibold"
          >
            {design.width} cm
          </text>

          {/* Vertical dimension line */}
          <line
            x1={padding - 20}
            y1={padding + 20}
            x2={padding - 20}
            y2={padding + 20 + height}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <line
            x1={padding - 25}
            y1={padding + 20}
            x2={padding - 15}
            y2={padding + 20}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <line
            x1={padding - 25}
            y1={padding + 20 + height}
            x2={padding - 15}
            y2={padding + 20 + height}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <text
            x={padding - 40}
            y={padding + 20 + height / 2}
            textAnchor="middle"
            className="text-xs fill-slate-700 font-semibold"
          >
            {design.height} cm
          </text>
        </g>

        {/* Top View - Small rectangle showing depth */}
        <g id="top-view" transform={`translate(${padding + width + 30}, ${padding + 20})`}>
          <text x={depth / 2} y={-5} textAnchor="middle" className="text-xs font-semibold fill-slate-900">
            VISTA SUPERIOR
          </text>

          <rect
            x="0"
            y="0"
            width={depth}
            height={depth * 0.6}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="stroke-slate-800"
          />

          {/* Depth dimension */}
          <line
            x1="0"
            y1={depth * 0.6 + 15}
            x2={depth}
            y2={depth * 0.6 + 15}
            stroke="currentColor"
            strokeWidth="1"
            className="stroke-slate-600"
          />
          <text
            x={depth / 2}
            y={depth * 0.6 + 30}
            textAnchor="middle"
            className="text-xs fill-slate-700 font-semibold"
          >
            {design.depth} cm
          </text>
        </g>

        {/* Legend */}
        <g id="legend" transform={`translate(${padding}, ${padding + height + 80})`}>
          <text y="0" className="text-xs font-semibold fill-slate-900">
            ESPECIFICACIONES:
          </text>
          <text y="15" className="text-xs fill-slate-700">
            • Material: {design.material}
          </text>
          <text y="30" className="text-xs fill-slate-700">
            • Complejidad: {["Baja", "Media", "Alta", "Muy Alta"][design.complexity - 1]}
          </text>
          <text y="45" className="text-xs fill-slate-700">
            • Escala: 1:{Math.round(100 / scale)}
          </text>
        </g>
      </svg>
    </div>
  );
}
