import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden border-b border-border bg-black pt-12">
      <div className="absolute inset-0">
        <Image
          alt="Interior editorial con mobiliario de hierro y madera"
          className="object-cover"
          fill
          fetchPriority="high"
          priority
          sizes="100vw"
          src="/Muebles_Estilo_Insdustrial_4.jpg"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 pb-14 sm:px-8 md:pb-20 lg:px-12">
        <div className="max-w-5xl space-y-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/65">
            Est. 2024
          </p>
          <h1 className="max-w-5xl text-4xl font-light uppercase leading-[0.88] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Mobiliario industrial en hierro y madera para espacios contemporáneos.
          </h1>
          <p className="max-w-2xl text-base font-light leading-8 text-white sm:text-xl">
            Diseñamos y fabricamos piezas a medida que combinan la robustez del metal con la calidez de la madera, priorizando la funcionalidad y el lenguaje arquitectónico.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex border border-white bg-white px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-transparent hover:text-white"
            href="/productos"
          >
            Ver colección
          </Link>
          <Link
            className="inline-flex border border-white/60 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white hover:bg-white/10"
            href="/contacto"
          >
            Diseño personalizado
          </Link>
        </div>
      </div>
    </section>
  );
}
