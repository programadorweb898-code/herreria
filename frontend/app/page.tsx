import Image from "next/image";
import Link from "next/link";

import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getFeaturedProducts } from "@/data/products";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-neutral-950 text-white">
      <HeroSection />
      <MarqueeBanner />

      <section className="border-b border-white/5 bg-neutral-950 px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 divide-y divide-white/5 border-y border-white/5 md:grid-cols-3 md:divide-x md:divide-y-0">
            <article className="py-10 md:px-10 md:py-12 md:first:pl-0">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">
                Colaboraciones
              </p>
              <h2 className="mb-5 text-3xl font-light tracking-[-0.04em] text-white">
                Beneficios para clientes de obra y compras por volumen.
              </h2>
              <p className="max-w-sm text-sm font-light leading-7 text-neutral-400">
                Desarrollamos propuestas para estudios, locales y proyectos residenciales con
                escalas de fabricación ajustadas al uso real.
              </p>
            </article>

            <article className="py-10 md:px-10 md:py-12">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">
                Arquitectura
              </p>
              <h2 className="mb-5 text-3xl font-light tracking-[-0.04em] text-white">
                Acompañamiento técnico para interioristas y arquitectos.
              </h2>
              <p className="max-w-sm text-sm font-light leading-7 text-neutral-400">
                Traducimos planos, medidas y terminaciones en piezas claras, sobrias y bien resueltas.
              </p>
            </article>

            <article className="py-10 md:px-10 md:py-12 md:last:pr-0">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">
                Personalización
              </p>
              <h2 className="mb-5 text-3xl font-light tracking-[-0.04em] text-white">
                Diseños a medida según espacio, escala y materialidad.
              </h2>
              <p className="max-w-sm text-sm font-light leading-7 text-neutral-400">
                Cada pieza puede adaptarse a requerimientos específicos manteniendo un lenguaje material consistente.
              </p>
            </article>
          </div>
        </div>
      </section>
      
      <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-10" id="catalogo">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14 flex flex-col gap-6 border-b border-white/5 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-400">
                Stock limitado
              </p>
              <h2 className="text-4xl font-light uppercase tracking-[-0.04em] text-white sm:text-5xl">
                Colección de productos
              </h2>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-neutral-900 px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center gap-6 pr-0 lg:pr-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
              Estudio
            </p>
            <h2 className="text-4xl font-medium uppercase tracking-[-0.04em] text-white sm:text-5xl">
              Precisión industrial con sensibilidad espacial.
            </h2>
            <p className="max-w-xl text-base font-light leading-8 text-neutral-400">
              Nuestro trabajo parte de la estructura. Cada mesa, biblioteca o perchero se define por
              su presencia material, su equilibrio visual y la manera en que habita el espacio.
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden border border-white/5 bg-neutral-800">
            <Image
              alt="Ambiente con muebles de hierro de lenguaje arquitectónico"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/Gemini_Generated_Image_yyzrylyyzrylyyzr.png"
            />
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-6 py-24 text-center sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.32em] text-emerald-400">
            ¿Listo para empezar?
          </p>
          <h2 className="mb-10 text-4xl font-light tracking-[-0.04em] text-white sm:text-6xl">
            Integrá hierro, madera y precisión en tu próximo proyecto.
          </h2>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WhatsAppButton
              className="w-full border-emerald-500 bg-emerald-500 px-8 py-5 text-[10px] font-bold text-black hover:bg-emerald-600 sm:w-auto transition-colors"
              message="Hola! Me gustaría hacer una consulta."
              phone="+5491155606321"
            >
              Contactar por WhatsApp
            </WhatsAppButton>
            <Link
              href="/showroom"
              className="w-full border border-white/10 bg-white/5 px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white/10 sm:w-auto"
            >
              Diseño personalizado
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
