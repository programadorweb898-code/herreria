import Image from "next/image";
import { notFound } from "next/navigation";

import WhatsAppButton from "@/components/WhatsAppButton";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import { formatPrice, formatWhatsAppPrice } from "@/lib/format";
import { getProduct } from "@/data/products";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const phone = "+5491100000000";

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Herrería Estudio",
    };
  }

  return {
    title: `${product.name} | Herrería Estudio`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const message = `Hola! Me interesa: ${product.name} - Precio: $${formatWhatsAppPrice(product.price)}. ¿Me podés dar más info?`;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32 sm:px-8 sm:pb-24 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <ProductImageCarousel 
          image={product.image} 
          name={product.name} 
          additionalImages={product.additionalImages} 
        />

        <div className="flex flex-col justify-center gap-8">
          <div className="space-y-4 border-b border-border pb-8">
            <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">
              {product.category}
            </p>
            <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-foreground">{formatPrice(product.price)}</p>
          </div>

          <div className="space-y-5">
            <p className="text-base font-light leading-8 text-slate-600">{product.description}</p>
            <p className="text-sm font-light uppercase tracking-[0.18em] text-slate-500">
              {product.inStock ? "Disponible para consulta" : "Consultar disponibilidad"}
            </p>
          </div>

          <div>
            <WhatsAppButton className="px-6 py-4" message={message} phone={phone}>
              Consultar por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
