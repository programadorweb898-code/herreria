import { NextRequest, NextResponse } from "next/server";

interface DesignRequest {
  prompt: string;
}

interface DesignResponse {
  description: string;
  width: number;
  height: number;
  depth: number;
  complexity: number;
  material: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt }: DesignRequest = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt inválido" },
        { status: 400 }
      );
    }

    // Integramos con Gemini API
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GEMINI_API_KEY no configurada");
      // Respuesta simulada para desarrollo sin API key
      return NextResponse.json(generateMockResponse(prompt));
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(prompt),
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error en Gemini API");
    }

    const data = await response.json();
    const content = data.contents?.[0]?.parts?.[0]?.text;

    if (!content) {
      throw new Error("Respuesta vacía de Gemini");
    }

    // Parseamos la respuesta JSON
    const designData = parseDesignResponse(content);
    return NextResponse.json(designData);
  } catch (error) {
    console.error("Error en design-generator API:", error);
    return NextResponse.json(
      { error: "Error procesando el diseño" },
      { status: 500 }
    );
  }
}

function buildPrompt(userPrompt: string): string {
  return `Eres un experto en diseño de muebles de herrería. Analiza esta descripción de cliente y extrae las dimensiones, material y complejidad.

Descripción del cliente: "${userPrompt}"

Responde SOLO en formato JSON válido (sin markdown, sin comillas adicionales) con esta estructura exacta:
{
  "description": "Descripción breve del diseño",
  "width": número en cm,
  "height": número en cm,
  "depth": número en cm,
  "complexity": número del 1 al 4,
  "material": "hierro|acero|acero_inoxidable|madera|combinado"
}

Notas:
- Si el cliente no especifica dimensión, usa valores típicos (ej: 150cm ancho, 80cm alto)
- Complexity: 1=simple/lineal, 2=modular básico, 3=diseño arquitectónico, 4=muy elaborado
- Siempre extrae el material mencionado o usa "acero" por defecto`;
}

function parseDesignResponse(content: string): DesignResponse {
  try {
    // Limpia markdown si existe
    let cleanContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanContent);

    return {
      description: parsed.description || "Diseño personalizado",
      width: Math.max(30, Math.min(300, parseInt(parsed.width) || 150)),
      height: Math.max(30, Math.min(300, parseInt(parsed.height) || 100)),
      depth: Math.max(20, Math.min(100, parseInt(parsed.depth) || 30)),
      complexity: Math.max(1, Math.min(4, parseInt(parsed.complexity) || 2)),
      material: parsed.material || "acero",
    };
  } catch {
    return generateMockResponse("");
  }
}

function generateMockResponse(prompt: string): DesignResponse {
  // Valores simulados basados en el prompt
  const hasLarge = /grande|200|alto/i.test(prompt);
  const hasSimple = /simple|básico|minimal/i.test(prompt);
  const hasComplex = /complejo|múltiple|elaborado/i.test(prompt);

  return {
    description: "Diseño personalizado según especificaciones",
    width: hasLarge ? 200 : 150,
    height: hasLarge ? 220 : 100,
    depth: 35,
    complexity: hasComplex ? 3 : hasSimple ? 1 : 2,
    material: prompt.toLowerCase().includes("acero inoxidable")
      ? "acero_inoxidable"
      : "acero",
  };
}
