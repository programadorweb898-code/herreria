# Generador de Diseños Personalizados - Configuración

## Descripción

Se ha integrado un sistema de generación de diseños personalizados que funciona con IA (Google Gemini) para:
1. Analizar prompts del cliente
2. Generar planos técnicos automáticos
3. Calcular precios basados en dimensiones y complejidad

## Configuración Requerida

### 1. Google Gemini API (Gratuita)

Para habilitar la integración con IA:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita la API "Generative Language API"
4. Crea una API key en "Credenciales"
5. Copia tu API key

### 2. Variable de Entorno

Agrega a tu archivo `.env.local`:

```
GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
```

### 3. Uso sin API Key (Modo Demo)

Si no configuras la API key, el sistema funciona con respuestas simuladas para development.

## Archivos Creados

- `/app/api/design-generator/route.ts` - API endpoint para procesar prompts con Gemini
- `/components/DesignGeneratorForm.tsx` - Formulario interactivo
- `/components/TechnicalDrawing.tsx` - Generador de planos técnicos en SVG

## Funcionalidades

### Análisis de Prompt
- Extrae dimensiones (ancho, alto, profundidad)
- Identifica material (hierro, acero, acero inoxidable, etc)
- Calcula nivel de complejidad (1-4)

### Plano Técnico
- Vista frontal con dimensiones
- Vista superior con profundidad
- Sistema de medidas técnicas
- Escalas y leyenda

### Cálculo de Precio
Fórmula: 
```
Precio = PrecioBase + (Area * CostoPorM²) * MultplicadorComplejidad
```

- Precio Base: $50,000 ARS
- Costo por m²: $10,000 ARS
- Multiplicador: 1 + (Complejidad × 0.3)

## Ejemplos de Prompts

✅ "Estantería modular de 200cm de alto, 150cm de ancho, 30cm de profundidad. Estructura en acero inoxidable con 4 estantes. Diseño industrial."

✅ "Mesa de trabajo simple, 160cm largo, 80cm alto, 60cm profundo. Acero reforzado."

✅ "Espejo con marco de hierro forjado, 120x100cm, diseño elaborado con marcos decorativos"

## Limitaciones API Gratuita

- Gemini API Pro: 15 llamadas por minuto en plan gratuito
- No requiere tarjeta de crédito para empezar
- Ideal para prototipos y desarrollo

## Proximas Mejoras

- [ ] Integración de almacenamiento de cotizaciones
- [ ] Email con cotización generada
- [ ] Exportar plano a PDF
- [ ] Visualización 3D del diseño
