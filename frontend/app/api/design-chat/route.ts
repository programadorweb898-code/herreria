import { NextRequest, NextResponse } from "next/server";
import { parseMeasurements } from "@/lib/measurement-parser";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface ParsedDesignData {
  width?: string | number;
  height?: string | number;
  depth?: string | number;
  complexity?: string | number;
  material?: string;
  description?: string;
}

interface DesignPayload {
  width: number;
  height: number;
  depth: number;
  complexity: number;
  material: string;
  description: string;
  price: number;
}

interface ChatResponsePayload {
  response: string;
  design: DesignPayload | null;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;
    const message = body.message;
    const conversationHistory = Array.isArray(body.conversationHistory)
      ? body.conversationHistory
      : [];

    console.log("=== Design Chat Request ===");
    console.log("Message:", message);
    console.log("Message type:", typeof message);
    console.log("History length:", conversationHistory.length);
    console.log("History is array:", Array.isArray(conversationHistory));

    if (!message || typeof message !== "string") {
      console.error("Invalid message - returning smart response for invalid input");
      const result = generateSmartResponse("saludo");
      console.log("Invalid message result:", {
        response: result.response?.substring?.(0, 50) + "...",
        design: result.design ? "yes" : "no",
      });
      return NextResponse.json(result);
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      console.log("No API key configured, using smart response");
      const result = generateSmartResponse(message);
      console.log("No-API-key result:", {
        response: result.response?.substring?.(0, 50) + "...",
        design: result.design ? "yes" : "no",
      });
      return NextResponse.json(result);
    }

    const contents: GeminiContent[] = [];

    for (const msg of conversationHistory) {
      if (msg.role && msg.content) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    console.log("Calling Gemini with", contents.length, "message(s)");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text: buildSystemPrompt(),
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      return NextResponse.json(generateSmartResponse(message));
    }

    const data = (await response.json()) as GeminiResponse;
    const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Gemini response received, length:", assistantResponse?.length || 0);

    if (!assistantResponse) {
      console.log("Empty Gemini response, using smart response");
      return NextResponse.json(generateSmartResponse(message));
    }

    let design: DesignPayload | null = null;
    try {
      const jsonMatch = assistantResponse.match(/\{\s*"width"[\s\S]*?\}/);
      if (jsonMatch) {
        const designData = JSON.parse(jsonMatch[0]) as ParsedDesignData;

        if (designData.width && designData.height && designData.depth) {
          const width = parseInt(String(designData.width), 10);
          const height = parseInt(String(designData.height), 10);
          const depth = parseInt(String(designData.depth), 10);
          const complexity = parseInt(String(designData.complexity ?? 2), 10) || 2;

          design = {
            width,
            height,
            depth,
            complexity,
            material: designData.material || "acero",
            description: designData.description || "DiseÃ±o personalizado",
            price: calculatePrice(width, height, depth, complexity),
          };
          console.log("Design extracted successfully");
        }
      }
    } catch {
      console.log("No valid design JSON in response");
    }

    const result: ChatResponsePayload = {
      response: assistantResponse,
      design,
    };

    console.log("=== Sending Response ===");
    console.log("Response has content:", !!result.response);
    console.log("Design included:", !!result.design);
    return NextResponse.json(result);
  } catch (error) {
    console.error("=== Chat API Critical Error ===", error);
    const fallback = generateSmartResponse("error");
    console.log("Returning fallback response:", {
      response: fallback.response?.substring?.(0, 50) + "...",
      design: fallback.design ? "yes" : "no",
    });
    return NextResponse.json(fallback);
  }
}

function buildSystemPrompt(): string {
  return `ERES UN ESPECIALISTA EN DISEÃ‘O Y ARQUITECTURA METALÃšRGICA

Tu identidad:
- Experto en diseÃ±o de interiores con especial foco en metalurgia y herrerÃ­a
- Trabajas para HerrerÃ­a Estudio, estudio especializado en fabricaciÃ³n de piezas metÃ¡licas personalizadas
- Eres conversacional, amigable pero profesional
- Dominas completamente medidas y especificaciones tÃ©cnicas

REGLA CRÃTICA - RESPETA SIEMPRE LAS MEDIDAS DEL USUARIO:
1. Si el usuario dice "150 cm de ancho", EXACTAMENTE 150 en el JSON
2. Si dice "1.5 m", convierte a 150 cm
3. Entiende: cm, m, mm, km y sus abreviaciones
4. Nunca cambies las medidas propuestas sin el consentimiento explÃ­cito del usuario
5. Si el usuario dibuja medidas con comillas (ej: 150" x 80"), confirma que entiendiste bien

CÃ“MO CONVERSAR:
- Saludos â†’ Responde calurosamente y pregunta sobre el proyecto
- Cliente describe un proyecto â†’ Haz preguntas arquitectÃ³nicas especÃ­ficas:
  * Dimensiones/medidas
  * Material (acero, hierro, inoxidable, combinado con madera)
  * Acabado (mate, pulido, patinado, oxidado)
  * FunciÃ³n y contexto
  * Carga/resistencia requerida
  * Estilo (industrial, minimalista, artesanal, clÃ¡sico)
  
- Cliente da medidas â†’ CONFIRMA que entendiste bien ANTES de generar JSON

CUANDO GENERES DISEÃ‘O - JSON OBLIGATORIO AL FINAL:
{
  "width": nÃºmero_en_cm,
  "height": nÃºmero_en_cm,
  "depth": nÃºmero_en_cm,
  "complexity": 1-4 (1=simple, 2=intermedio, 3=complejo, 4=muy complejo),
  "material": "acero|hierro|acero_inoxidable|madera|combinado",
  "description": "descripciÃ³n tÃ©cnica y especificaciones"
}

EJEMPLOS REALES:

Escenario A - Usuario con medidas claras:
Cliente: "Quiero una estanterÃ­a de 200 cm de ancho, 180 cm de alto y 40 cm de profundidad, en acero"
Tu respuesta: "Â¡Perfecto! DÃ©jame confirmar tu diseÃ±o:
- Ancho: 200 cm
- Alto: 180 cm  
- Profundidad: 40 cm
- Material: Acero

Â¿CuÃ¡ntos niveles/estantes prefieres? Â¿AlgÃºn acabado especial para el acero (mate, pulido, patinado)?"

[Si confirma los detalles, generas el JSON con EXACTAMENTE 200, 180, 40]

Escenario B - Usuario sin medidas:
Cliente: "Necesito un escritorio de oficina"
Tu respuesta: "Â¡Excelente! Un buen escritorio es fundamental. CuÃ©ntame:
- Â¿Espacio disponible? (aproximado en metros o visualizaciÃ³n)
- Â¿Para una persona o dos?
- Â¿Con cajones o patas abiertas?
- Â¿Material preferido? Acero, acero inoxidable, o combinado con madera?"

Escenario C - Usuario corrige:
Cliente: "Mejor que sean 160 cm de ancho, no 200"
Tu respuesta: "Anotado. Ajustamos a 160 cm de ancho. El resto se mantiene: 180 alto, 40 profundidad, acero. Â¿Algo mÃ¡s?"
[Generas JSON con 160 exactamente]

REGLAS DE ORO:
âœ“ Lenguaje tÃ©cnico pero accesible
âœ“ Siempre confirma medidas antes de diseÃ±ar
âœ“ Si el usuario dice una medida, esa es LA medida (no sugieras cambios sin preguntar)
âœ“ Detalla en la descripciÃ³n: material, acabado, complejidad de fabricaciÃ³n, cargas recomendadas
âœ“ SÃ© especÃ­fico: no generes diseÃ±os vagos, sÃ© preciso en especificaciones
âœ“ Puedes sugerir estÃ¡ndares industriales como referencia PERO respeta la voluntad del usuario

NUNCA:
âœ— Ignores las medidas del usuario
âœ— Cambies especificaciones sin confirmaciÃ³n
âœ— Generes JSON sin que el usuario haya validado el diseÃ±o
âœ— Hagas diseÃ±os imposibles fÃ­sicamente (valida que sean tÃ©cnicamente viables)

Dominas vocabulario arquitectÃ³nico en espaÃ±ol:
- Ancho/largo (horizontal)
- Alto/altura (vertical)
- Profundidad/fondo (dimensiÃ³n frontal)
- Espesor/grosor (material)
- Carga/resistencia
- Acabado (mate, brillante, pulido, patinado)
- Junta/soldadura
- Estructura/marco
- Panel/tablero`;
}

function calculatePrice(
  width: number,
  height: number,
  depth: number,
  complexity: number
): number {
  const basePrice = 50000;
  const area = (width * height + height * depth + width * depth) / 1000;
  const complexityMultiplier = 1 + (complexity - 1) * 0.3;
  return Math.round(basePrice + area * 10000 * complexityMultiplier);
}

function generateSmartResponse(message: string): ChatResponsePayload {
  const lowerMessage = message.toLowerCase().trim();
  let response = "";
  let design: DesignPayload | null = null;

  const measurements = parseMeasurements(message);
  const hasMeasurements =
    measurements.confidence > 0 &&
    (measurements.width || measurements.height || measurements.depth);

  if (
    lowerMessage === "hola" ||
    lowerMessage === "hola!" ||
    lowerMessage.includes("buenos") ||
    lowerMessage === "hi" ||
    lowerMessage === "hey"
  ) {
    response =
      "Â¡Hola! Bienvenido a HerrerÃ­a Estudio. Soy tu especialista en diseÃ±o y arquitectura metalÃºrgica. Â¿CuÃ¡l es el proyecto que tienes en mente? Â¿EstanterÃ­a, escritorio, espejo, o algo completamente personalizado?";
  } else if (
    lowerMessage.includes("estanterÃ­a") ||
    lowerMessage.includes("estante") ||
    lowerMessage.includes("rack")
  ) {
    if (hasMeasurements) {
      const w = measurements.width || 150;
      const h = measurements.height || 180;
      const d = measurements.depth || 35;

      response = `Â¡Perfecto! He anotado tus medidas exactas para la estanterÃ­a:
- Ancho: ${w} cm
- Alto: ${h} cm
- Profundidad: ${d} cm

Ahora necesito confirmar:
- Â¿Tipo de material? (acero natural, acero inoxidable, hierro o combinado con madera)
- Â¿Acabado? (mate, pulido, patinado)
- Â¿CuÃ¡ntos niveles/estantes?

Te genero el diseÃ±o 3D con cotizaciÃ³n exacta una vez confirmes estos detalles.`;

      design = {
        width: w,
        height: h,
        depth: d,
        complexity: 2,
        material: "acero",
        description: `EstanterÃ­a personalizada - ${w}Ã—${h}Ã—${d}cm`,
        price: calculatePrice(w, h, d, 2),
      };
    } else {
      response = `Â¡Excelente! Las estanterÃ­as son uno de nuestros proyectos favoritos.

Para diseÃ±ar la tuya a medida, necesito:
- **Medidas** (ancho, alto, profundidad) - ej: "150 cm de ancho, 180 de alto, 40 de profundo"
- **Material**: acero, acero inoxidable, hierro, o combinado con madera
- **Acabado**: mate, pulido, patinado, etc.
- **Niveles**: Â¿cuÃ¡ntos estantes necesitas?

Si prefieres, te muestro nuestro modelo estÃ¡ndar: **150cm ancho Ã— 180cm alto Ã— 35cm profundidad en acero**.`;
    }
  } else if (
    lowerMessage.includes("escritorio") ||
    lowerMessage.includes("mesa de trabajo") ||
    lowerMessage.includes("desk") ||
    lowerMessage.includes("mesa")
  ) {
    if (hasMeasurements) {
      const w = measurements.width || 160;
      const h = measurements.height || 75;
      const d = measurements.depth || 70;

      response = `Â¡Perfecto! Anotado tu escritorio personalizado:
- Ancho: ${w} cm
- Alto: ${h} cm (altura de trabajo)
- Profundidad: ${d} cm

Excelentes dimensiones para un workspace profesional. Solo confirma:
- **Material**: Â¿Acero puro, acero + madera en tapa, acero inoxidable?
- **Cajones/almacenaje**: Â¿prefieres cajones laterales o estructura abierta?
- **Acabado**: mate, pulido, detalles especiales?

Te genero el diseÃ±o 3D con precio exacto.`;

      design = {
        width: w,
        height: h,
        depth: d,
        complexity: 2,
        material: "combinado",
        description: `Escritorio industrial personalizado - ${w}Ã—${h}Ã—${d}cm`,
        price: calculatePrice(w, h, d, 2),
      };
    } else {
      response = `Â¡Perfecto! Un buen escritorio es fundamental para la productividad.

Para diseÃ±ar el tuyo exactamente como necesitas:
- **Medidas**: ancho, alto de trabajo (generalmente 75-80cm), profundidad
- **Material**: acero, acero + madera (muy popular), acero inoxidable
- **Cargas**: Â¿quÃ© peso debe soportar? (monitores, equipo, libros, etc.)
- **Consideraciones**: Â¿necesitas pasacables, organizadores integrados?

Nuestro modelo bestseller: **160cm ancho Ã— 75cm alto Ã— 70cm profundidad**.`;
    }
  } else if (lowerMessage.includes("espejo") || lowerMessage.includes("mirror")) {
    response = `Â¡Hermoso! Un espejo con marco de hierro o acero es una pieza arquitectÃ³nica increÃ­ble. 

Te propongo:
- **Dimensiones**: 120cm ancho Ã— 85cm alto
- **Marco**: Hierro forjado de 5-8cm de ancho
- **Acabado**: Mate, pulido o patinado

Â¿Te gusta este tamaÃ±o? Â¿QuÃ© estilo prefieres? Te diseÃ±o el plano y cotizaciÃ³n.`;

    design = {
      width: 120,
      height: 85,
      depth: 5,
      complexity: 2,
      material: "hierro",
      description: "Espejo con marco de hierro forjado",
      price: calculatePrice(120, 85, 5, 2),
    };
  } else if (
    lowerMessage.includes("precio") ||
    lowerMessage.includes("costo") ||
    lowerMessage.includes("cuÃ¡nto cuesta") ||
    lowerMessage.includes("presupuesto") ||
    lowerMessage.includes("valor")
  ) {
    response = `Excelente pregunta sobre precios. 

En HerrerÃ­a Estudio, cada proyecto es Ãºnico y el precio depende de:
- **Dimensiones**: El tamaÃ±o de la pieza
- **Material**: Hierro < Acero < Acero Inoxidable
- **Complejidad**: DiseÃ±os simples vs muy elaborados
- **Acabado**: Mate, pulido, patinado, etc.

**Precios aproximados (ARS):**
- EstanterÃ­a modular: desde $120,000
- Escritorio industrial: desde $150,000
- Espejo decorativo: desde $85,000

Â¿CuÃ¡l es tu proyecto? CuÃ©ntame detalles y te doy una cotizaciÃ³n exacta con plano tÃ©cnico.`;
  } else if (
    lowerMessage.includes("material") ||
    lowerMessage.includes("acero") ||
    lowerMessage.includes("hierro")
  ) {
    response = `Excelente pregunta. Trabajamos con varios materiales premium:

**Hierro**: Tradicional, forjado, muy resistente, perfecto para designs clÃ¡sicos/industriales.

**Acero**: VersÃ¡til, resistente, buen precio, ideal para diseÃ±os modernos. Disponible en diferentes acabados.

**Acero Inoxidable**: Premium, resistente a la corrosiÃ³n (ideal para exteriores), brillante, larga durabilidad.

**Combinado**: Acero/hierro con madera. Hermosa combinaciÃ³n clÃ¡sica + moderna.

Â¿CuÃ¡l te atrae? Cada uno tiene sus ventajas segÃºn dÃ³nde vaya la pieza.`;
  } else if (
    lowerMessage.includes("trabajo") ||
    lowerMessage.includes("proyecto") ||
    lowerMessage.includes("portfolio") ||
    lowerMessage.includes("galerÃ­a")
  ) {
    response = `Â¡Claro! En HerrerÃ­a Estudio tenemos proyectos increÃ­bles realizados:

- EstanterÃ­as modulares para living y oficinas
- Escritorios industriales personalizados
- Espejos con marcos forjados
- Bancos y asientos metÃ¡licos
- Mesas de centro y auxiliares
- Instalaciones custom para comercios

Cada proyecto es Ãºnico y diseÃ±ado segÃºn las necesidades de nuestros clientes.

Â¿Hay algÃºn tipo especÃ­fico de pieza que te gustarÃ­a ver o diseÃ±emos juntos?`;
  } else if (
    lowerMessage.includes("quiÃ©nes son") ||
    lowerMessage.includes("quien eres") ||
    lowerMessage.includes("sobre ustedes") ||
    lowerMessage.includes("experiencia") ||
    lowerMessage.includes("estudio")
  ) {
    response = `Â¡Me alegra que preguntes! 

Somos **HerrerÃ­a Estudio**, un taller especializado en diseÃ±o y fabricaciÃ³n de piezas metÃ¡licas personalizadas desde hace aÃ±os. 

**Nos especializamos en:**
- Muebles personalizados (estanterÃ­as, escritorios, mesas)
- DiseÃ±o arquitectÃ³nico en metal
- Objetos decorativos con hierro y acero
- Acabados artesanales de precisiÃ³n

**Nuestro proceso:**
1. Escuchamos tu idea
2. DiseÃ±amos un plano tÃ©cnico
3. Te presentamos cotizaciÃ³n
4. Fabricamos con precisiÃ³n
5. Entregamos tu pieza Ãºnica

Â¿Hay algo que te gustarÃ­a diseÃ±ar?`;
  } else if (
    lowerMessage.includes("cuÃ¡nto tiempo") ||
    lowerMessage.includes("cuÃ¡ntos dÃ­as") ||
    lowerMessage.includes("entrega") ||
    lowerMessage.includes("proceso")
  ) {
    response = `Buena pregunta sobre tiempos.

El proceso generalmente es:
1. **Consulta y diseÃ±o**: 2-3 dÃ­as (te muestro plano tÃ©cnico)
2. **ConfirmaciÃ³n**: 1 dÃ­a (confirmas detalles)
3. **FabricaciÃ³n**: VarÃ­a segÃºn complejidad (7-21 dÃ­as tÃ­picamente)
4. **Acabados**: 3-5 dÃ­as
5. **Entrega**: SegÃºn ubicaciÃ³n

Para projects simples: ~2-3 semanas
Para projects complejos: 4-6 semanas

Â¿QuÃ© tipo de pieza tienes en mente? Te doy un timeline exacto.`;
  } else {
    response = `Gracias por tu mensaje. ðŸ˜Š

En HerrerÃ­a Estudio podemos ayudarte con diseÃ±o y fabricaciÃ³n de:
- **EstanterÃ­as** personalizadas
- **Escritorios** industriales  
- **Espejos** con marcos metÃ¡licos
- **Muebles** custom en acero e hierro
- Cualquier pieza que imagines en metal

Â¿QuÃ© te interesa? CuÃ©ntame tu idea y juntos creamos algo increÃ­ble.`;
  }

  return { response, design };
}
