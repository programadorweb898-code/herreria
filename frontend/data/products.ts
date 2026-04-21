import { getProductImage } from "@/lib/product-images";
import type { Product } from "@/types/product";

const products: Product[] = [
  {
    _id: "1",
    slug: "perchero",
    name: "Estantería Tupungato",
    price: 89000,
    description:
      "La Estantería Tupungato es la síntesis perfecta entre minimalismo y robustez. Diseñada para optimizar espacios pequeños con un impacto visual imponente, esta pieza vertical de Ironwood aporta una organización sofisticada y un diseño industrial purista a tu hogar.",
    detailDescription: `Estructura vertical de hierro sólido
Estantes de madera maciza de pino de 20mm
Ideal para espacios reducidos o recibidores
Anclaje de seguridad a pared
Color a elección en madera y metal

Somos Ironwood`,
    category: "Guardado",
    inStock: true,
    image: getProductImage("perchero"),
    additionalImages: ["/download (4).jpg", "/download (5).jpg"],
    width: 100,
    height: 180,
    depth: 20,
    modelPath: "/models/Estanteria.glb",
  },
  {
    _id: "2",
    slug: "estanteria-modular",
    name: "Estantería Montecarlo",
    price: 245000,
    description:
      "La Estantería Montecarlo es una declaración de estilo industrial puro. Su estructura robusta y sus estantes de pino cuidadosamente seleccionados ofrecen una solución de guardado imponente y versátil, diseñada por Ironwood para transformar cualquier ambiente con carácter y funcionalidad.",
    detailDescription: `Metal: Caño estructural 20x40mm
Madera: Pino
Diseño Industrial
Color a elección en madera y metal
100cm de ancho
4 medidas disponibles: 180 y 150cm de alto, y 20 o 30cm de profundidad

Somos Ironwood`,
    category: "Guardado",
    inStock: true,
    image: getProductImage("estanteria-modular"),
    additionalImages: ["/download (1).jpg", "/download.jpg"],
    width: 100,
    height: 180,
    depth: 30,
    modelPath: "/models/Estanteria.glb",
  },
  {
    _id: "3",
    slug: "mesa-auxiliar-cubica",
    name: "Dresuar Filadelfia",
    price: 132000,
    description:
      "El Dresuar Filadelfia es la pieza ideal para recibirte en casa con elegancia. Su estructura esbelta y sus acabados artesanales en madera y metal crean un ambiente cálido y sofisticado en cualquier recibidor o pasillo, reflejando el diseño impecable de Ironwood.",
    detailDescription: `Estructura de caño estructural 15x15
Estantes de madera de pino, teñido y encerado
Medidas: 80cm (alto) x 30cm (profundidad) x 100cm (ancho)
Color a elección en madera y metal

Somos Ironwood`,
    category: "Mesas",
    inStock: true,
    image: getProductImage("mesa-auxiliar-cubica"),
    additionalImages: ["/download (6).jpg", "/download (7).jpg"],
    width: 100,
    height: 80,
    depth: 30,
    modelPath: "/models/dresuar-filadelfia.glb",
  },
  {
    _id: "4",
    slug: "estanteria-pared-lineal",
    name: "Bodega Milán",
    price: 198000,
    description:
      "Nuestra Bodega Milán es la fusión perfecta entre funcionalidad y diseño industrial. Una pieza de colgar sofisticada que realza cualquier rincón de tu hogar, ofreciendo un soporte seguro y elegante para tus mejores vinos con el sello distintivo de Ironwood.",
    detailDescription: `Madera tratada, teñida y lustrada
Espacio para 5 botellas
Diseño Moderno/Industrial
Para colgar en pared
Color a elección en madera y metal

Somos Ironwood`,
    category: "Bodegas",
    inStock: true,
    image: getProductImage("estanteria-pared-lineal"),
    additionalImages: ["/download (8).jpg", "/download (9).jpg"],
    width: 60,
    height: 40,
    depth: 15,
    modelPath: "/models/bodega-milan.glb",
  },
  {
    _id: "5",
    slug: "estanteria-acero-geometrico",
    name: "Banqueta Cali",
    price: 185000,
    description:
      "Banqueta industrial con el sello de calidad de Ironwood. Fabricada con asiento de madera de pino de 30mm de espesor y una estructura robusta en caño estructural de 25x25mm. Medidas: 30x30x75cm. Color a elección tanto para la madera como para el metal, disponible en los dos modelos publicados. Una pieza duradera que aporta carácter y funcionalidad a cualquier ambiente.",
    detailDescription: `Madera de Pino de 30mm de espesor
Caño Estructural 25x25mm
Disponible en los 2 modelos publicados
Color a elección en madera y metal
Medidas: 30x30x75cm

Somos Ironwood`,
    category: "Banqueta Cali",
    inStock: true,
    image: getProductImage("estanteria-acero-geometrico"),
    additionalImages: ["/download (2).jpg", "/download (3).jpg"],
    width: 30,
    height: 75,
    depth: 30,
    modelPath: "/models/base.glb",
  },
  {
    _id: "6",
    slug: "banco-industrial",
    name: "Mesa Ratona",
    price: 118000,
    description:
      "Nuestra Mesa Ratona redefine el centro de tu sala con una robustez inigualable y un estilo industrial auténtico. La combinación de madera de pino de gran espesor y una estructura de hierro imponente la convierte en el punto de encuentro perfecto para tu hogar.",
    detailDescription: `Medidas: 100x55x45cm
Madera: Pino Cepillado y Tratado de 40mm de espesor.
Metal: Caño estructural 80x20mm
Color a elección en madera y en hierro

Somos Ironwood`,
    category: "Mesas",
    inStock: true,
    image: getProductImage("banco-industrial"),
    additionalImages: ["/download (10).jpg", "/download (11).jpg"],
    width: 100,
    height: 45,
    depth: 55,
    modelPath: "/models/base.glb",
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.slice(0, 6);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const decodedSlug = decodeURIComponent(slug);
  console.log('Buscando producto con slug:', decodedSlug);
  return products.find((product) => product.slug === decodedSlug) ?? null;
}
