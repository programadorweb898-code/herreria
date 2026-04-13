# 🏗️ Asistente de Diseño 3D - Guía de Instalación

## ¿Qué cambió?

Tu asistente de diseño ahora es **especializado en arquitectura** con las siguientes mejoras:

✅ **Entiende medidas en español**
   - cm, m, mm, km
   - Palabras: "centímetros", "metros", "ancho", "alto", "profundidad", etc.
   - Ejemplo: "una estantería de 150 cm ancho, 180 alto y 40 de fondo"

✅ **Respeta exactamente tus medidas**
   - No cambia lo que propones sin confirmación
   - Usa tus medidas exactas en el diseño
   - Confirma las especificaciones antes de diseñar

✅ **Visualización 3D interactiva**
   - Reemplazó los planos 2D por modelos 3D
   - Rotación automática para ver todos los ángulos
   - Colores según material (acero, inoxidable, madera, combinado)

✅ **Chat especializado en arquitectura**
   - Domina vocabulario técnico en español
   - Pregunta sobre acabados, cargas, estilos
   - Propone estándares industriales

---

## 📦 Instalación

### Paso 1: Instalar dependencias de Three.js

En tu terminal (cmd o PowerShell como administrador):

```bash
cd c:\Users\gomit\carpeta\project_herreria\frontend
npm install
```

Esto instalará:
- `three` - Motor gráfico 3D
- `@types/three` - Tipos de TypeScript para Three.js

### Paso 2: Iniciar el servidor

```bash
npm run dev
```

Verás: `Local: http://localhost:3000`

### Paso 3: Probar el asistente

1. Abre `http://localhost:3000/diseno-personalizado`
2. Comienza a chatear

---

## 💬 Cómo usar el asistente

### Ejemplo 1: Con medidas claras

**Tú:** "Necesito una estantería de 200 cm de ancho, 180 cm de alto y 50 de profundidad"

**Asistente:**
- ✓ Reconoce tus medidas exactas: 200×180×50
- ✓ Confirma antes de diseñar
- ✓ Pregunta sobre material y acabado
- ✓ Genera el diseño 3D con TUS medidas

### Ejemplo 2: Con medidas aproximadas

**Tú:** "1.5 metros de ancho, 2 metros de alto"

**Asistente:**
- ✓ Convierte: 1.5m = 150cm, 2m = 200cm
- ✓ Pregunta la profundidad
- ✓ Propone modelo estándar si lo necesitas

### Ejemplo 3: Proyecto libre

**Tú:** "Quiero un escritorio para oficina, industrial"

**Asistente:**
- ✓ Pregunta especificaciones
- ✓ Propone dimensión estándar (160×75×70cm)
- ✓ Confirma detalles antes de diseñar

---

## 🎨 Materiales disponibles

El asistente entiende estos materiales:
- **acero** - Hierro industrial, acabado mate
- **hierro** - Hierro forjado, artesanal
- **acero_inoxidable** - Plateado, brillante
- **madera** - Para combinaciones
- **combinado** - Acero + madera (muy popular)

Puedes decir:
- "en acero"
- "acero inoxidable"
- "acero con tapa de madera"
- "combinado"

---

## 📐 Vocabulario de medidas que entiende

| Dimensión | Palabras que reconoce |
|-----------|----------------------|
| **Ancho** | ancho, anchura, largo, base |
| **Alto** | alto, altura, profundidad vertical |
| **Profundidad** | profundidad, fondo, espesor |
| **Unidades** | cm, m, mm, km, "centímetros", "metros" |

### Ejemplos de frases que entiende:
- "150 cm de ancho" ✓
- "1.5 m de largo" ✓
- "180 alto, 40 fondo" ✓
- "200cm x 150cm x 50cm" ✓
- "2 metros x 1 metro" ✓

---

## 🖼️ Visualización 3D

Cuando el asistente propone o diseña una pieza:

1. **Modelo 3D será visible en la pantalla**
   - Rotación automática
   - Color según material
   - Dimensiones etiquetadas

2. **Verás las especificaciones**
   - Medidas exactas
   - Material
   - Complejidad
   - Precio estimado

3. **Puedes seguir diseñando**
   - "Hazlo más ancho"
   - "Cambia a acero inoxidable"
   - "Agrega 2 estantes"

---

## ⚙️ Características técnicas

### Parser de medidas inteligente
- Detecta automáticamente números y unidades
- Convierte a centímetros (unidad base)
- Identifica qué dimensión es cada medida

### Sistema de respuestas
1. **Gemini API** - Respuestas inteligentes de IA (si está configurada)
2. **Fallback inteligente** - Respuestas predefinidas especializadas

### Generación de precios
Fórmula: `Precio = Base(50k ARS) + (Área × Factor × Complejidad)`

---

## 🐛 Solucionar problemas

### "El menú 3D no aparece"
**Solución:** 
1. Verifica que npm install terminó correctamente
2. Recarga la página (Ctrl+F5)
3. Abre Console (F12) para ver errores

### "El asistente no entiende mis medidas"
**Solución:**
- Sé específico: "150 cm de ancho" en lugar de "150 ancho"
- Usa comas decimales o puntos: "1,5 m" o "1.5 m"
- Confirma visualmente: el asistente te repetirá las medidas

### "Dice 'conectando con Gemini...' pero no responde"
**Solución:**
1. Verifica que tu API key sea valida en `.env.local`
2. Abre Console (F12) para ver el error específico
3. El sistema usará respuestas predefinidas si Gemini falla

---

## 📝 Archivos nuevos/modificados

**Nuevos:**
- `frontend/lib/measurement-parser.ts` - Parser de medidas
- `frontend/components/Design3D.tsx` - Visualizador 3D
- `frontend/app/api/test/route.ts` - Endpoint de prueba

**Modificados:**
- `frontend/components/DesignGeneratorForm.tsx` - Ahora usa Design3D
- `frontend/app/api/design-chat/route.ts` - Mejorado con especialización
- `frontend/package.json` - Agregadas dependencias de Three.js

---

## 🚀 Pro tips

1. **Sé conversacional**
   - No necesitas escribir "por favor analiza..."
   - Di naturalmente: "necesito un escritorio así y asá"

2. **Confirma antes de pedir cambios**
   - El asistente sempre confirmará medidas
   - Esto evita malentendidos

3. **Puedes iterar**
   - "Hazlo más ancho" → ajusta medidas
   - "Cambia el acabado" → propone opciones
   - "¿Cuánto costaría en acero inoxidable?" → recotiza

---

¡Listo! Tu asistente de diseño 3D está configurado. 🎉

Cualquier duda, revisa los logs de la consola (F12).
