/**
 * Parser especializado para medidas en espaÃ±ol
 * Entiende: cm, m, mm, km, "centÃ­metros", "metros", etc.
 */

export interface ParsedMeasurements {
  width?: number;
  height?: number;
  depth?: number;
  length?: number;
  diameter?: number;
  radius?: number;
  thickness?: number;
  rawInput: string;
  confidence: number;
}

const unitPatterns = {
  cm: ["cm", "centÃ­metro", "centÃ­metros", "centÃ­metro(s)", "cm.", "c\\.?m\\.?"],
  m: ["m", "metro", "metros", "metro(s)", "m."],
  mm: ["mm", "milÃ­metro", "milÃ­metros", "milÃ­metro(s)", "mm."],
  km: ["km", "kilÃ³metro", "kilÃ³metros", "kilÃ³metro(s)", "km."],
};

const dimensionPatterns = {
  width: ["ancho", "ancho(a)", "ancho(as)", "anchura", "anchura(s)", "largo", "base"],
  height: ["alto", "altura", "alto(s)", "alto(a)", "altura(s)", "profundidad vertical"],
  depth: ["profundidad", "fondo", "profundidad(es)", "distancia", "espesor"],
  length: ["largo", "longitud", "largo(s)", "largo(a)", "longitud(es)"],
  diameter: ["diÃ¡metro", "diametro", "diÃ¡metro(s)", "diametro(s)", "Ã˜"],
  radius: ["radio", "radio(s)", "radio(a)"],
  thickness: ["espesor", "grosor", "espesor(es)", "grosor(es)"],
};

type DimensionKey = keyof typeof dimensionPatterns;

interface NumericMatch {
  value: string;
  unit: string;
  index: number;
}

export function parseMeasurements(text: string): ParsedMeasurements {
  const result: ParsedMeasurements = {
    rawInput: text,
    confidence: 0,
  };

  if (!text) return result;

  const lowerText = text.toLowerCase().replace(/[,]/g, ".");
  const numberWithUnitPattern = /(\d+(?:[.,]\d+)?)\s*([a-z]+(?:\(.+?\))?)/gi;

  let matches: NumericMatch[] = Array.from(lowerText.matchAll(numberWithUnitPattern)).map(
    (match) => ({
      value: match[1],
      unit: match[2] ?? "",
      index: match.index ?? 0,
    })
  );

  if (matches.length === 0) {
    const numberPattern = /\b(\d+(?:[.,]\d+)?)\b/g;
    matches = Array.from(lowerText.matchAll(numberPattern)).map((match) => ({
      value: match[1],
      unit: "",
      index: match.index ?? 0,
    }));
  }

  let foundCount = 0;

  for (const match of matches) {
    const numberStr = match.value.replace(",", ".");
    const numberValue = parseFloat(numberStr);
    const unitStr = match.unit.toLowerCase().trim();

    if (Number.isNaN(numberValue)) continue;

    let value = numberValue;
    if (unitStr) {
      if (unitPatterns.m.some((unit) => unitStr.includes(unit.replace(/[()]/g, "")))) {
        value = numberValue * 100;
      } else if (unitPatterns.mm.some((unit) => unitStr.includes(unit.replace(/[()]/g, "")))) {
        value = numberValue / 10;
      } else if (unitPatterns.km.some((unit) => unitStr.includes(unit.replace(/[()]/g, "")))) {
        value = numberValue * 100000;
      }
    }

    const textBefore = lowerText.substring(0, match.index);
    let dimension: DimensionKey | null = null;

    for (const [dim, patterns] of Object.entries(dimensionPatterns)) {
      for (const pattern of patterns) {
        const dimPattern = new RegExp(`\\b${pattern.replace(/[()]/g, "")}\\b`);
        if (dimPattern.test(textBefore.split(/(?:y|o|,|\s)/).pop() || "")) {
          dimension = dim as DimensionKey;
          break;
        }
      }
      if (dimension) break;
    }

    if (!dimension) {
      if (!result.width) dimension = "width";
      else if (!result.height) dimension = "height";
      else if (!result.depth) dimension = "depth";
    }

    if (dimension) {
      assignMeasurement(result, dimension, Math.round(value));
      foundCount++;
    }
  }

  result.confidence = Math.min(foundCount / 3, 1);

  return result;
}

export function formatMeasurement(
  value: number,
  unit: "cm" | "m" | "mm" = "cm"
): string {
  if (unit === "m") {
    return `${(value / 100).toFixed(2)} m`;
  }
  if (unit === "mm") {
    return `${(value * 10).toFixed(0)} mm`;
  }
  return `${value} cm`;
}

function assignMeasurement(
  result: ParsedMeasurements,
  dimension: DimensionKey,
  value: number
) {
  switch (dimension) {
    case "width":
      result.width = value;
      break;
    case "height":
      result.height = value;
      break;
    case "depth":
      result.depth = value;
      break;
    case "length":
      result.length = value;
      break;
    case "diameter":
      result.diameter = value;
      break;
    case "radius":
      result.radius = value;
      break;
    case "thickness":
      result.thickness = value;
      break;
  }
}

export function fromStringToNumber(value: string | number): number {
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
