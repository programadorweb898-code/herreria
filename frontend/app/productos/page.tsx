import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nuestros Trabajos | Herreria Estudio",
};

const trabajos = [
  {
    id: 1,
    title: "Estanteria Modular Living",
    description:
      "Sistema de guardado modular en acero inoxidable con proporcion horizontal. Disenado para integrar espacios de living contemporaneo con lineas limpias y presencia arquitectonica.",
    image: "/Gemini_Generated_Image_j2a86aj2a86aj2a8.png",
  },
  {
    id: 2,
    title: "Escritorio Workspace",
    description:
      "Escritorio de oficina con estructura en acero y tapa en madera. Pensado para profesionales que valoran la precision, la funcionalidad y el diseno minimalista en sus espacios de trabajo.",
    image: "/Gemini_Generated_Image_udsx03udsx03udsx.png",
  },
];

export default function NuestrosTrabajos() {
  return (
    <div className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-10 sm:px-8 sm:pb-10 lg:px-12">
        <div className="mb-10 space-y-3 border-b border-white/5 pb-8 text-center">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            Nuestros Trabajos
          </h1>
          <p className="mx-auto w-full max-w-6xl text-base font-light leading-7 text-neutral-400 md:text-lg">
            Seleccion de proyectos desarrollados con precision, materiales honestos y
            vision arquitectonica. Cada pieza es un testimonio de nuestro compromiso con
            la excelencia.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
          {trabajos.map((trabajo) => (
            <article
              key={trabajo.id}
              className="group flex flex-col border border-white/5 bg-neutral-900 transition duration-300 hover:border-white/15"
            >
              <div className="relative aspect-[1.12/1] overflow-hidden bg-neutral-800">
                <Image
                  alt={trabajo.title}
                  className="object-cover grayscale transition duration-500 group-hover:scale-[1.02]"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={trabajo.image}
                />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6 md:p-7 lg:p-8">
                <div className="space-y-2">
                  <h2 className="text-lg font-light uppercase tracking-[0.14em] text-white transition group-hover:text-emerald-400 md:text-[1.35rem]">
                    {trabajo.title}
                  </h2>
                  <p className="max-w-[52ch] text-sm font-light leading-6 text-neutral-400 md:text-[15px]">
                    {trabajo.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="w-full border-t border-white/5 bg-neutral-900 px-6 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-light tracking-tighter text-white md:text-4xl">
            Tienes un proyecto en mente?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-8 text-neutral-400">
            Trabajamos con arquitectos e interioristas para desarrollar mobiliario
            industrial en hierro y madera que transforma cada espacio con precision y
            calidez.
          </p>
          <Link
            href="/showroom"
            className="inline-block bg-white px-8 py-3 text-sm font-light uppercase tracking-[0.1em] text-black transition hover:bg-neutral-200"
          >
            Explorar Disenos personalizados
          </Link>
        </div>
      </section>
    </div>
  );
}
