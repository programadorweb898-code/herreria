import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nuestros Trabajos | Herrería Estudio",
};

const trabajos = [
  {
    id: 1,
    title: "Estantería Modular Living",
    description:
      "Sistema de guardado modular en acero inoxidable con proporción horizontal. Diseñado para integrar espacios de living contemporáneo con líneas limpias y presencia arquitectónica.",
    image: "/Gemini_Generated_Image_j2a86aj2a86aj2a8.png",
  },
  {
    id: 2,
    title: "Escritorio Workspace",
    description:
      "Escritorio de oficina con estructura en acero y tapa en madera. Pensado para profesionales que valoran la precisión, la funcionalidad y el diseño minimalista en sus espacios de trabajo.",
    image: "/Gemini_Generated_Image_udsx03udsx03udsx.png",
  },
];

export default function NuestrosTrabajos() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-12 sm:px-8 sm:pb-16 lg:px-12">
        <div className="mb-16 max-w-2xl space-y-4">
          <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">
            Portafolio
          </p>
          <h1 className="text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
            Nuestros Trabajos
          </h1>
          <p className="text-base font-light leading-8 text-slate-600">
            Selección de proyectos desarrollados con precisión, materiales honestos y visión arquitectónica.
            Cada pieza es un testimonio de nuestro compromiso con la excelencia.
          </p>
        </div>
      </div>

      {/* Grid de trabajos */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pb-20 sm:pb-24 lg:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {trabajos.map((trabajo) => (
            <article
              key={trabajo.id}
              className="group flex flex-col border border-border bg-white transition duration-300 hover:border-foreground"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  alt={trabajo.title}
                  className="object-cover grayscale transition duration-500 group-hover:scale-[1.02]"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={trabajo.image}
                />
              </div>

              <div className="flex flex-1 flex-col gap-5 p-8 md:p-10">
                <div className="space-y-3">
                  <h2 className="text-lg md:text-xl font-light uppercase tracking-[0.2em] text-foreground transition group-hover:text-accent">
                    {trabajo.title}
                  </h2>
                  <p className="text-sm font-light leading-6 text-slate-600">
                    {trabajo.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-base font-light text-slate-600 mb-8 max-w-2xl mx-auto">
            Trabajamos con arquitectos e interioristas para desarrollar mobiliario industrial 
            en hierro y madera que transforma cada espacio con precisión y calidez.
          </p>
          <Link
            href="/showroom"
            className="inline-block bg-foreground text-white px-8 py-3 font-light uppercase tracking-[0.1em] text-sm hover:bg-slate-800 transition"
          >
            Explorar diseño personalizado
          </Link>
        </div>
      </section>
    </div>
  );
}
