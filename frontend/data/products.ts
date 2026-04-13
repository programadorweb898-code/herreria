import { getProductImage } from "@/lib/product-images";
import type { Product } from "@/types/product";

const products: Product[] = [
  {
    _id: "1",
    slug: "perchero",
    name: "Perchero",
    price: 89000,
    description:
      "Perchero vertical con diseño industrial. Pieza compacta y resistente que resuelve apoyo diario con una presencia precisa.",
    category: "Accesorios",
    inStock: true,
    image: getProductImage("perchero"),
  },
  {
    _id: "2",
    slug: "estanteria-modular",
    name: "Estantería modular",
    price: 245000,
    description:
      "Sistema de guardado modular en hierro con lenguaje industrial contemporáneo. Resuelve almacenamiento y exhibición con una estructura liviana y firme.",
    category: "Guardado",
    inStock: true,
    image: getProductImage("estanteria-modular"),
  },
  {
    _id: "3",
    slug: "mesa-auxiliar-cubica",
    name: "Mesa auxiliar cúbica",
    price: 132000,
    description:
      "Mesa auxiliar con estructura geométrica cúbica en hierro. Ideal para espacios de trabajo y como punto focal decorativo.",
    category: "Mesas",
    inStock: true,
    image: getProductImage("mesa-auxiliar-cubica"),
  },
  {
    _id: "4",
    slug: "estanteria-pared-lineal",
    name: "Estantería de pared lineal",
    price: 198000,
    description:
      "Estantería mural de líneas limpias con estructura metálica. Pensada para integrar almacenamiento sin perder claridad visual.",
    category: "Guardado",
    inStock: true,
    image: getProductImage("estanteria-pared-lineal"),
  },
  {
    _id: "5",
    slug: "estanteria-acero-geometrico",
    name: "Estantería de acero geométrico",
    price: 185000,
    description:
      "Estructura modular de acero con formas geométricas. Combina funcionalidad de almacenamiento con presencia arquitectónica.",
    category: "Guardado",
    inStock: true,
    image: getProductImage("estanteria-acero-geometrico"),
  },
  {
    _id: "6",
    slug: "banco-industrial",
    name: "Banco industrial",
    price: 118000,
    description:
      "Banco con estructura de hierro forjado. Pieza versátil que funciona como asiento o como elemento decorativo en espacios abiertos.",
    category: "Asientos",
    inStock: true,
    image: getProductImage("banco-industrial"),
  },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.slice(0, 6);
}

export async function getProduct(slug: string): Promise<Product | null> {
  return products.find((product) => product.slug === slug) ?? null;
}
