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

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface RawDesignResponse {
  description?: unknown;
  width?: string | number;
  height?: string | number;
  depth?: string | number;
  complexity?: string | number;
  material?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt }: DesignRequest = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt invÃ¡lido" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GEMINI_API_KEY no configurada");
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

    const data = (await response.json()) as GeminiResponse;
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("Respuesta vacÃ­a de Gemini");
    }

    const designData = parseDesignResponse(content);
    return NextResponse.json(designData);
  } catch (error) {
    console.error("Error en design-generator API:", error);
    return NextResponse.json(
      { error: "Error procesando el diseÃ±o" },
      { status: 500 }
    );
  }
}

function buildPrompt(userPrompt: string): string {
  return `Eres un experto en diseÃ±o de muebles de herrerÃ­a. Analiza esta descripciÃ³n de cliente y extrae las dimensiones, material y complejidad.

DescripciÃ³n del cliente: "${userPrompt}"

Responde SOLO en formato JSON vÃ¡lido (sin markdown, sin comillas adicionales) con esta estructura exacta:
{
  "description": "DescripciÃ³n breve del diseÃ±o",
  "width": nÃºmero en cm,
  "height": nÃºmero en cm,
  "depth": nÃºmero en cm,
  "complexity": nÃºmero del 1 al 4,
  "material": "hierro|acero|acero_inoxidable|madera|combinado"
}

Notas:
- Si el cliente no especifica dimensiÃ³n, usa valores tÃ­picos (ej: 150cm ancho, 80cm alto)
- Complexity: 1=simple/lineal, 2=modular bÃ¡sico, 3=diseÃ±o arquitectÃ³nico, 4=muy elaborado
- Siempre extrae el material mencionado o usa "acero" por defecto`;
}

function parseDesignResponse(content: string): DesignResponse {
  try {
    const cleanContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanContent) as RawDesignResponse;

    return {
      description:
        typeof parsed.description === "string"
          ? parsed.description
          : "DiseÃ±o personalizado",
      width: Math.max(30, Math.min(300, parseInt(String(parsed.width), 10) || 150)),
      height: Math.max(30, Math.min(300, parseInt(String(parsed.height), 10) || 75)),
      depth: Math.max(20, Math.min(100, parseInt(String(parsed.depth), 10) || 30)),
      complexity: Math.max(1, Math.min(4, parseInt(String(parsed.complexity), 10) || 2)),
      material: typeof parsed.material === "string" ? parsed.material : "acero",
    };
  } catch {
    return generateMockResponse("");
  }
}

function generateMockResponse(prompt: string): DesignResponse {
  const hasLarge = /grande|200|alto/i.test(prompt);
  const hasSimple = /simple|bÃ¡sico|minimal/i.test(prompt);
  const hasComplex = /complejo|mÃºltiple|elaborado/i.test(prompt);

  return {
    description: "DiseÃ±o personalizado segÃºn especificaciones",
    width: hasLarge ? 200 : 150,
    height: hasLarge ? 220 : 100,
    depth: 35,
    complexity: hasComplex ? 3 : hasSimple ? 1 : 2,
    material: prompt.toLowerCase().includes("acero inoxidable")
      ? "acero_inoxidable"
      : "acero",
  };
}
