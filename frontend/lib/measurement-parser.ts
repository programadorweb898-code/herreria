/**
 * Parser especializado para medidas en español
 * Entiende: cm, m, mm, km, "centímetros", "metros", etc.
 */

export interface ParsedMeasurements {
  width?: number; // en cm
  height?: number; // en cm
  depth?: number; // en cm
  length?: number; // en cm
  diameter?: number; // en cm
  radius?: number; // en cm
  thickness?: number; // en cm
  rawInput: string;
  confidence: number; // 0-1
}

// Variaciones de palabras en español para cada unidad
const unitPatterns = {
  cm: ['cm', 'centímetro', 'centímetros', 'centímetro(s)', 'cm.', 'c\\.?m\\.?'],
  m: ['m', 'metro', 'metros', 'metro(s)', 'm.'],
  mm: ['mm', 'milímetro', 'milímetros', 'milímetro(s)', 'mm.'],
  km: ['km', 'kilómetro', 'kilómetros', 'kilómetro(s)', 'km.'],
};

// Palabras en español para cada dimensión
const dimensionPatterns = {
  width: ['ancho', 'ancho(a)', 'ancho(as)', 'anchura', 'anchura(s)', 'largo', 'base'],
  height: ['alto', 'altura', 'alto(s)', 'alto(a)', 'altura(s)', 'profundidad vertical'],
  depth: ['profundidad', 'fondo', 'profundidad(es)', 'distancia', 'espesor'],
  length: ['largo', 'longitud', 'largo(s)', 'largo(a)', 'longitud(es)'],
  diameter: ['diámetro', 'diametro', 'diámetro(s)', 'diametro(s)', 'Ø'],
  radius: ['radio', 'radio(s)', 'radio(a)'],
  thickness: ['espesor', 'grosor', 'espesor(es)', 'grosor(es)'],
};

export function parseMeasurements(text: string): ParsedMeasurements {
  const result: ParsedMeasurements = {
    rawInput: text,
    confidence: 0,
  };

  if (!text) return result;

  const lowerText = text.toLowerCase().replace(/[,]/g, '.');

  // Patrones para números con unidades: "150 cm", "150cm", "1,5 m", "1.5m"
  const numberWithUnitPattern =
    /(\d+(?:[.,]\d+)?)\s*([a-z]+(?:\(.+?\))?)/gi;

  let matches = Array.from(lowerText.matchAll(numberWithUnitPattern));

  if (matches.length === 0) {
    // Si no hay coincidencias, intentar encontrar solo números
    const numberPattern = /\b(\d+(?:[.,]\d+)?)\b/g;
    matches = Array.from(lowerText.matchAll(numberPattern)).map((m) => [
      m[0],
      m[1],
      '',
    ] as any);
  }

  let foundCount = 0;

  for (const match of matches) {
    const numberStr = match[1].replace(',', '.');
    const numberValue = parseFloat(numberStr);
    const unitStr = (match[2] || '').toLowerCase().trim();

    if (isNaN(numberValue)) continue;

    // Detectar unidad y convertir a cm
    let value = numberValue;
    if (unitStr) {
      if (unitPatterns.m.some((u) => unitStr.includes(u.replace(/[()]/g, '')))) {
        value = numberValue * 100; // metros a cm
      } else if (unitPatterns.mm.some((u) => unitStr.includes(u.replace(/[()]/g, '')))) {
        value = numberValue / 10; // milímetros a cm
      } else if (unitPatterns.km.some((u) => unitStr.includes(u.replace(/[()]/g, '')))) {
        value = numberValue * 100000; // kilómetros a cm
      }
      // cm es la unidad por defecto
    }

    // Detectar dimensión (buscar en texto previo)
    const textBefore = lowerText.substring(0, match.index);
    let dimension: keyof typeof dimensionPatterns | null = null;

    for (const [dim, patterns] of Object.entries(dimensionPatterns)) {
      for (const pattern of patterns) {
        const dimPattern = new RegExp(`\\b${pattern.replace(/[()]/g, '')}\\b`);
        if (dimPattern.test(textBefore.split(/(?:y|o|,|\s)/).pop() || '')) {
          dimension = dim as keyof typeof dimensionPatterns;
          break;
        }
      }
      if (dimension) break;
    }

    // Si no se detectó dimensión, asignar por orden
    if (!dimension) {
      if (!result.width) dimension = 'width';
      else if (!result.height) dimension = 'height';
      else if (!result.depth) dimension = 'depth';
    }

    if (dimension) {
      (result as any)[dimension] = Math.round(value);
      foundCount++;
    }
  }

  // Calcular confianza
  result.confidence = Math.min(foundCount / 3, 1);

  return result;
}

export function formatMeasurement(
  value: number,
  unit: 'cm' | 'm' | 'mm' = 'cm'
): string {
  if (unit === 'm') {
    return `${(value / 100).toFixed(2)} m`;
  }
  if (unit === 'mm') {
    return `${(value * 10).toFixed(0)} mm`;
  }
  return `${value} cm`;
}

export function fromStringToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}
