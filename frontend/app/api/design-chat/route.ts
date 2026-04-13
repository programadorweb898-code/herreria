import { NextRequest, NextResponse } from "next/server";
import { parseMeasurements, formatMeasurement } from "@/lib/measurement-parser";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory }: ChatRequest = body;

    console.log("=== Design Chat Request ===");
    console.log("Message:", message);
    console.log("Message type:", typeof message);
    console.log("History length:", conversationHistory?.length || 0);
    console.log("History is array:", Array.isArray(conversationHistory));

    if (!message || typeof message !== "string") {
      console.error("Invalid message - returning smart response for invalid input");
      const result = generateSmartResponse("saludo", []);
      console.log("Invalid message result:", { response: result.response?.substring?.(0, 50) + "...", design: result.design ? "yes" : "no" });
      return NextResponse.json(result);
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      console.log("No API key configured, using smart response");
      const result = generateSmartResponse(message, conversationHistory || []);
      console.log("No-API-key result:", { response: result.response?.substring?.(0, 50) + "...", design: result.design ? "yes" : "no" });
      return NextResponse.json(result);
    }

    // Construir contenidos para Gemini
    const contents: any[] = [];

    // Agregar historial de conversación
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        if (msg.role && msg.content) {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          });
        }
      }
    }

    // Agregar nuevo mensaje
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
      return NextResponse.json(
        generateSmartResponse(message, conversationHistory || [])
      );
    }

    const data = await response.json();
    const assistantResponse = data.contents?.[0]?.parts?.[0]?.text;

    console.log("Gemini response received, length:", assistantResponse?.length || 0);

    if (!assistantResponse) {
      console.log("Empty Gemini response, using smart response");
      return NextResponse.json(
        generateSmartResponse(message, conversationHistory || [])
      );
    }

    // Intentar extraer JSON de diseño si existe
    let design = null;
    try {
      const jsonMatch = assistantResponse.match(
        /\{\s*"width"[\s\S]*?\}/
      );
      if (jsonMatch) {
        const designData = JSON.parse(jsonMatch[0]);

        // Validar que tenga los campos necesarios
        if (designData.width && designData.height && designData.depth) {
          design = {
            width: parseInt(designData.width),
            height: parseInt(designData.height),
            depth: parseInt(designData.depth),
            complexity: parseInt(designData.complexity) || 2,
            material: designData.material || "acero",
            description: designData.description || "Diseño personalizado",
            price: calculatePrice(
              parseInt(designData.width),
              parseInt(designData.height),
              parseInt(designData.depth),
              parseInt(designData.complexity) || 2
            ),
          };
          console.log("Design extracted successfully");
        }
      }
    } catch (err) {
      console.log("No valid design JSON in response");
    }

    const result = {
      response: assistantResponse,
      design,
    };

    console.log("=== Sending Response ===");
    console.log("Response has content:", !!result.response);
    console.log("Design included:", !!result.design);
    return NextResponse.json(result);
  } catch (error) {
    console.error("=== Chat API Critical Error ===", error);
    const fallback = generateSmartResponse("error", []);
    console.log("Returning fallback response:", { response: fallback.response?.substring?.(0, 50) + "...", design: fallback.design ? "yes" : "no" });
    return NextResponse.json(fallback);
  }
}

function buildSystemPrompt(): string {
  return `ERES UN ESPECIALISTA EN DISEÑO Y ARQUITECTURA METALÚRGICA

Tu identidad:
- Experto en diseño de interiores con especial foco en metalurgia y herrería
- Trabajas para Herrería Estudio, estudio especializado en fabricación de piezas metálicas personalizadas
- Eres conversacional, amigable pero profesional
- Dominas completamente medidas y especificaciones técnicas

REGLA CRÍTICA - RESPETA SIEMPRE LAS MEDIDAS DEL USUARIO:
1. Si el usuario dice "150 cm de ancho", EXACTAMENTE 150 en el JSON
2. Si dice "1.5 m", convierte a 150 cm
3. Entiende: cm, m, mm, km y sus abreviaciones
4. Nunca cambies las medidas propuestas sin el consentimiento explícito del usuario
5. Si el usuario dibuja medidas con comillas (ej: 150" x 80"), confirma que entiendiste bien

CÓMO CONVERSAR:
- Saludos → Responde calurosamente y pregunta sobre el proyecto
- Cliente describe un proyecto → Haz preguntas arquitectónicas específicas:
  * Dimensiones/medidas
  * Material (acero, hierro, inoxidable, combinado con madera)
  * Acabado (mate, pulido, patinado, oxidado)
  * Función y contexto
  * Carga/resistencia requerida
  * Estilo (industrial, minimalista, artesanal, clásico)
  
- Cliente da medidas → CONFIRMA que entendiste bien ANTES de generar JSON

CUANDO GENERES DISEÑO - JSON OBLIGATORIO AL FINAL:
{
  "width": número_en_cm,
  "height": número_en_cm,
  "depth": número_en_cm,
  "complexity": 1-4 (1=simple, 2=intermedio, 3=complejo, 4=muy complejo),
  "material": "acero|hierro|acero_inoxidable|madera|combinado",
  "description": "descripción técnica y especificaciones"
}

EJEMPLOS REALES:

Escenario A - Usuario con medidas claras:
Cliente: "Quiero una estantería de 200 cm de ancho, 180 cm de alto y 40 cm de profundidad, en acero"
Tu respuesta: "¡Perfecto! Déjame confirmar tu diseño:
- Ancho: 200 cm
- Alto: 180 cm  
- Profundidad: 40 cm
- Material: Acero

¿Cuántos niveles/estantes prefieres? ¿Algún acabado especial para el acero (mate, pulido, patinado)?"

[Si confirma los detalles, generas el JSON con EXACTAMENTE 200, 180, 40]

Escenario B - Usuario sin medidas:
Cliente: "Necesito un escritorio de oficina"
Tu respuesta: "¡Excelente! Un buen escritorio es fundamental. Cuéntame:
- ¿Espacio disponible? (aproximado en metros o visualización)
- ¿Para una persona o dos?
- ¿Con cajones o patas abiertas?
- ¿Material preferido? Acero, acero inoxidable, o combinado con madera?"

Escenario C - Usuario corrige:
Cliente: "Mejor que sean 160 cm de ancho, no 200"
Tu respuesta: "Anotado. Ajustamos a 160 cm de ancho. El resto se mantiene: 180 alto, 40 profundidad, acero. ¿Algo más?"
[Generas JSON con 160 exactamente]

REGLAS DE ORO:
✓ Lenguaje técnico pero accesible
✓ Siempre confirma medidas antes de diseñar
✓ Si el usuario dice una medida, esa es LA medida (no sugieras cambios sin preguntar)
✓ Detalla en la descripción: material, acabado, complejidad de fabricación, cargas recomendadas
✓ Sé específico: no generes diseños vagos, sé preciso en especificaciones
✓ Puedes sugerir estándares industriales como referencia PERO respeta la voluntad del usuario

NUNCA:
✗ Ignores las medidas del usuario
✗ Cambies especificaciones sin confirmación
✗ Generes JSON sin que el usuario haya validado el diseño
✗ Hagas diseños imposibles físicamente (valida que sean técnicamente viables)

Dominas vocabulario arquitectónico en español:
- Ancho/largo (horizontal)
- Alto/altura (vertical)
- Profundidad/fondo (dimensión frontal)
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
  const basePrice = 50000; // ARS
  const area = (width * height + height * depth + width * depth) / 1000;
  const complexityMultiplier = 1 + (complexity - 1) * 0.3;
  return Math.round(basePrice + area * 10000 * complexityMultiplier);
}

function generateSmartResponse(message: string, history: ChatMessage[]) {
  const lowerMessage = message.toLowerCase().trim();
  let response = "";
  let design = null;

  // Intentar extraer medidas del mensaje
  const measurements = parseMeasurements(message);
  const hasMeasurements =
    measurements.confidence > 0 &&
    (measurements.width || measurements.height || measurements.depth);

  // Saludos
  if (
    lowerMessage === "hola" ||
    lowerMessage === "hola!" ||
    lowerMessage.includes("buenos") ||
    lowerMessage === "hi" ||
    lowerMessage === "hey"
  ) {
    response =
      "¡Hola! Bienvenido a Herrería Estudio. Soy tu especialista en diseño y arquitectura metalúrgica. ¿Cuál es el proyecto que tienes en mente? ¿Estantería, escritorio, espejo, o algo completamente personalizado?";
  }

  // Estantería
  else if (
    lowerMessage.includes("estantería") ||
    lowerMessage.includes("estante") ||
    lowerMessage.includes("rack")
  ) {
    if (hasMeasurements) {
      // Usuario proporciona medidas específicas
      const w = measurements.width || 150;
      const h = measurements.height || 180;
      const d = measurements.depth || 35;

      response = `¡Perfecto! He anotado tus medidas exactas para la estantería:
- Ancho: ${w} cm
- Alto: ${h} cm
- Profundidad: ${d} cm

Ahora necesito confirmar:
- ¿Tipo de material? (acero natural, acero inoxidable, hierro o combinado con madera)
- ¿Acabado? (mate, pulido, patinado)
- ¿Cuántos niveles/estantes?

Te genero el diseño 3D con cotización exacta una vez confirmes estos detalles.`;

      design = {
        width: w,
        height: h,
        depth: d,
        complexity: 2,
        material: "acero",
        description: `Estantería personalizada - ${w}×${h}×${d}cm`,
        price: calculatePrice(w, h, d, 2),
      };
    } else {
      // Sin medidas, proponer estándar
      response = `¡Excelente! Las estanterías son uno de nuestros proyectos favoritos.

Para diseñar la tuya a medida, necesito:
- **Medidas** (ancho, alto, profundidad) - ej: "150 cm de ancho, 180 de alto, 40 de profundo"
- **Material**: acero, acero inoxidable, hierro, o combinado con madera
- **Acabado**: mate, pulido, patinado, etc.
- **Niveles**: ¿cuántos estantes necesitas?

Si prefieres, te muestro nuestro modelo estándar: **150cm ancho × 180cm alto × 35cm profundidad en acero**.`;
    }
  }

  // Escritorio
  else if (
    lowerMessage.includes("escritorio") ||
    lowerMessage.includes("mesa de trabajo") ||
    lowerMessage.includes("desk") ||
    lowerMessage.includes("mesa")
  ) {
    if (hasMeasurements) {
      // Usuario proporciona medidas
      const w = measurements.width || 160;
      const h = measurements.height || 75;
      const d = measurements.depth || 70;

      response = `¡Perfecto! Anotado tu escritorio personalizado:
- Ancho: ${w} cm
- Alto: ${h} cm (altura de trabajo)
- Profundidad: ${d} cm

Excelentes dimensiones para un workspace profesional. Solo confirma:
- **Material**: ¿Acero puro, acero + madera en tapa, acero inoxidable?
- **Cajones/almacenaje**: ¿prefieres cajones laterales o estructura abierta?
- **Acabado**: mate, pulido, detalles especiales?

Te genero el diseño 3D con precio exacto.`;

      design = {
        width: w,
        height: h,
        depth: d,
        complexity: 2,
        material: "combinado",
        description: `Escritorio industrial personalizado - ${w}×${h}×${d}cm`,
        price: calculatePrice(w, h, d, 2),
      };
    } else {
      response = `¡Perfecto! Un buen escritorio es fundamental para la productividad.

Para diseñar el tuyo exactamente como necesitas:
- **Medidas**: ancho, alto de trabajo (generalmente 75-80cm), profundidad
- **Material**: acero, acero + madera (muy popular), acero inoxidable
- **Cargas**: ¿qué peso debe soportar? (monitores, equipo, libros, etc.)
- **Consideraciones**: ¿necesitas pasacables, organizadores integrados?

Nuestro modelo bestseller: **160cm ancho × 75cm alto × 70cm profundidad**.`;
    }
  }

  // Espejo
  else if (lowerMessage.includes("espejo") || lowerMessage.includes("mirror")) {
    response = `¡Hermoso! Un espejo con marco de hierro o acero es una pieza arquitectónica increíble. 

Te propongo:
- **Dimensiones**: 120cm ancho × 85cm alto
- **Marco**: Hierro forjado de 5-8cm de ancho
- **Acabado**: Mate, pulido o patinado

¿Te gusta este tamaño? ¿Qué estilo prefieres? Te diseño el plano y cotización.`;

    design = {
      width: 120,
      height: 85,
      depth: 5,
      complexity: 2,
      material: "hierro",
      description: "Espejo con marco de hierro forjado",
      price: calculatePrice(120, 85, 5, 2),
    };
  }

  // Precio
  else if (
    lowerMessage.includes("precio") ||
    lowerMessage.includes("costo") ||
    lowerMessage.includes("cuánto cuesta") ||
    lowerMessage.includes("presupuesto") ||
    lowerMessage.includes("valor")
  ) {
    response = `Excelente pregunta sobre precios. 

En Herrería Estudio, cada proyecto es único y el precio depende de:
- **Dimensiones**: El tamaño de la pieza
- **Material**: Hierro < Acero < Acero Inoxidable
- **Complejidad**: Diseños simples vs muy elaborados
- **Acabado**: Mate, pulido, patinado, etc.

**Precios aproximados (ARS):**
- Estantería modular: desde $120,000
- Escritorio industrial: desde $150,000
- Espejo decorativo: desde $85,000

¿Cuál es tu proyecto? Cuéntame detalles y te doy una cotización exacta con plano técnico.`;
  }

  // Materiales
  else if (
    lowerMessage.includes("material") ||
    lowerMessage.includes("acero") ||
    lowerMessage.includes("hierro")
  ) {
    response = `Excelente pregunta. Trabajamos con varios materiales premium:

**Hierro**: Tradicional, forjado, muy resistente, perfecto para designs clásicos/industriales.

**Acero**: Versátil, resistente, buen precio, ideal para diseños modernos. Disponible en diferentes acabados.

**Acero Inoxidable**: Premium, resistente a la corrosión (ideal para exteriores), brillante, larga durabilidad.

**Combinado**: Acero/hierro con madera. Hermosa combinación clásica + moderna.

¿Cuál te atrae? Cada uno tiene sus ventajas según dónde vaya la pieza.`;
  }

  // Diseño/Portfolio
  else if (
    lowerMessage.includes("trabajo") ||
    lowerMessage.includes("proyecto") ||
    lowerMessage.includes("portfolio") ||
    lowerMessage.includes("galería")
  ) {
    response = `¡Claro! En Herrería Estudio tenemos proyectos increíbles realizados:

- Estanterías modulares para living y oficinas
- Escritorios industriales personalizados
- Espejos con marcos forjados
- Bancos y asientos metálicos
- Mesas de centro y auxiliares
- Instalaciones custom para comercios

Cada proyecto es único y diseñado según las necesidades de nuestros clientes.

¿Hay algún tipo específico de pieza que te gustaría ver o diseñemos juntos?`;
  }

  // Sobre nosotros
  else if (
    lowerMessage.includes("quiénes son") ||
    lowerMessage.includes("quien eres") ||
    lowerMessage.includes("sobre ustedes") ||
    lowerMessage.includes("experiencia") ||
    lowerMessage.includes("estudio")
  ) {
    response = `¡Me alegra que preguntes! 

Somos **Herrería Estudio**, un taller especializado en diseño y fabricación de piezas metálicas personalizadas desde hace años. 

**Nos especializamos en:**
- Muebles personalizados (estanterías, escritorios, mesas)
- Diseño arquitectónico en metal
- Objetos decorativos con hierro y acero
- Acabados artesanales de precisión

**Nuestro proceso:**
1. Escuchamos tu idea
2. Diseñamos un plano técnico
3. Te presentamos cotización
4. Fabricamos con precisión
5. Entregamos tu pieza única

¿Hay algo que te gustaría diseñar?`;
  }

  // Proceso/Tiempo
  else if (
    lowerMessage.includes("cuánto tiempo") ||
    lowerMessage.includes("cuántos días") ||
    lowerMessage.includes("entrega") ||
    lowerMessage.includes("proceso")
  ) {
    response = `Buena pregunta sobre tiempos.

El proceso generalmente es:
1. **Consulta y diseño**: 2-3 días (te muestro plano técnico)
2. **Confirmación**: 1 día (confirmas detalles)
3. **Fabricación**: Varía según complejidad (7-21 días típicamente)
4. **Acabados**: 3-5 días
5. **Entrega**: Según ubicación

Para projects simples: ~2-3 semanas
Para projects complejos: 4-6 semanas

¿Qué tipo de pieza tienes en mente? Te doy un timeline exacto.`;
  }

  // Default - pregunta general amable
  else {
    response = `Gracias por tu mensaje. 😊

En Herrería Estudio podemos ayudarte con diseño y fabricación de:
- **Estanterías** personalizadas
- **Escritorios** industriales  
- **Espejos** con marcos metálicos
- **Muebles** custom en acero e hierro
- Cualquier pieza que imagines en metal

¿Qué te interesa? Cuéntame tu idea y juntos creamos algo increíble.`;
  }

  return { response, design };
}

function generateErrorResponse() {
  return NextResponse.json({
    response:
      "¡Hola! Bienvenido a Herrería Estudio. Soy tu asistente de diseño personalizado. ¿En qué puedo ayudarte? Puedo asesorarte sobre estanterías, escritorios, espejos, y otros muebles metálicos personalizados.",
    design: null,
  });
}

