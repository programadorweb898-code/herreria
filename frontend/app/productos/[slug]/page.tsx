import { notFound } from "next/navigation";
import Link from "next/link";

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
      title: "Producto no encontrado | HerrerÃ­a Estudio",
    };
  }

  return {
    title: `${product.name} | HerrerÃ­a Estudio`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const message = `Hola! Me interesa: ${product.name} - Precio: $${formatWhatsAppPrice(product.price)}. Â¿Me podÃ©s dar mÃ¡s info?`;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 sm:px-8 sm:pb-24 lg:px-12">
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
            <p className="whitespace-pre-line text-base font-light leading-8 text-slate-600">
              {product.detailDescription || product.description}
            </p>
            <p className="text-sm font-light uppercase tracking-[0.18em] text-slate-500">
              {product.inStock ? "Disponible para consulta" : "Consultar disponibilidad"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <WhatsAppButton className="w-full justify-center px-6 py-4 text-[10px]" message={message} phone={phone}>
              Consultar por WhatsApp
            </WhatsAppButton>
            
            <Link
              href={`/diseno-personalizado?product=${product.slug}&width=${product.width}&height=${product.height}&depth=${product.depth}`}
              className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
            >
              Diseño personalizado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
