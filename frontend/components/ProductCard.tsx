import Image from "next/image";
import Link from "next/link";

import { formatPrice, formatWhatsAppPrice } from "@/lib/format";
import type { Product } from "@/types/product";
import WhatsAppButton from "@/components/WhatsAppButton";

interface ProductCardProps {
  product: Product;
}

const phone = "+5491100000000";

export default function ProductCard({ product }: ProductCardProps) {
  const message = `Hola! Me interesa: ${product.name} - Precio: $${formatWhatsAppPrice(product.price)}. ¿Me podés dar más info?`;

  return (
    <article className="group flex h-full flex-col border border-border bg-white p-6 transition duration-300 hover:border-foreground">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link className="block h-full w-full" href={`/productos/${product.slug}`}>
          <Image
            alt={product.name}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={product.image}
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-5 pt-6">
        <div className="space-y-3">
          <Link href={`/productos/${product.slug}`}>
            <h3 className="text-sm font-light uppercase tracking-[0.2em] text-foreground transition group-hover:text-accent">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs font-light leading-6 text-slate-500">{product.description}</p>
        </div>

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <span className="mb-3 block text-lg font-light tracking-[-0.03em] text-foreground">
            {formatPrice(product.price)}
          </span>
          <WhatsAppButton className="w-full justify-center px-4 py-3 text-[10px]" message={message} phone={phone}>
            Contactar por WhatsApp
          </WhatsAppButton>
          <Link 
            href="/diseno-personalizado"
            className="inline-flex w-full items-center justify-center bg-black px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
          >
            Diseño personalizado
          </Link>
        </div>
      </div>
    </article>
  );
}
