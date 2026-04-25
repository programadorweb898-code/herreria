import Image from "next/image";

export const metadata = {
  title: "Quienes somos | Herreria Estudio",
};

export default function QuienesSomosPage() {
  return (
    <div className="overflow-x-hidden bg-neutral-950 text-white">
      <section className="relative flex h-[550px] w-full items-end overflow-hidden bg-black px-6 pb-12 pt-8 sm:px-8 sm:pb-16 md:h-[700px] lg:px-12 lg:pb-24">
        <Image
          alt="Herreria Estudio - Nuestra Historia"
          className="absolute inset-0 object-cover"
          fill
          priority
          sizes="100vw"
          src="/Gemini_Generated_Image_a4ph4a4ph4a4ph4a.png"
        />
        <div className="absolute inset-0 opacity-60">
          <div className="h-full w-full bg-gradient-to-b from-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-4xl">
            <span className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-white/60">
              HERRERIA ESTUDIO
            </span>
            <h1 className="text-5xl font-extralight leading-none tracking-tighter text-white md:text-7xl lg:text-8xl">
              Nuestra Historia
            </h1>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-neutral-950 px-6 py-16 sm:px-8 md:py-24 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-3xl font-light leading-[1.1] tracking-tighter text-white md:text-5xl">
            Diseno, Hierro y Madera
          </h2>
          <div className="space-y-6">
            <p className="text-lg font-light leading-relaxed text-neutral-300 md:text-xl">
              En Herreria Estudio, fusionamos la robustez del hierro industrial con la
              calidez de maderas nobles para crear piezas unicas. Concebimos el
              mobiliario como una extension de la arquitectura del lugar, donde cada
              detalle responde a una necesidad funcional y estetica.
            </p>
            <p className="text-base font-light leading-[1.8] text-neutral-400">
              Nuestros procesos combinan la precision tecnica de la metalurgia con la
              sensibilidad del trabajo artesanal en madera. Desde bibliotecas modulares
              hasta mesas de gran porte, cada pieza es disenada bajo estandares de
              excelencia, asegurando durabilidad y un lenguaje visual coherente.
            </p>
            <div className="flex flex-col items-center pt-8">
              <div className="mb-4 h-px w-24 bg-white/15"></div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                Mobiliario con Lenguaje Arquitectonico
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-neutral-900 px-6 py-16 sm:px-8 md:py-24 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-12">
            <div className="group relative h-[500px] w-full md:h-[620px] lg:h-[700px]">
              <Image
                alt="Proceso de diseno y fabricacion - Herreria Estudio"
                className="h-full w-full object-cover shadow-2xl"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src="/Gemini_Generated_Image_6fjvaz6fjvaz6fjv.png"
              />
              <div className="pointer-events-none absolute inset-0 border-[15px] border-white/5"></div>
              <div className="absolute bottom-6 left-6 right-6 border-l-2 border-white bg-black/80 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-light uppercase tracking-wider text-white">
                  Desarrollo de mobiliario a medida e industrial
                </p>
              </div>
            </div>

            <div className="w-full text-white">
              <h3 className="mb-10 text-4xl font-extralight leading-none tracking-tighter text-white md:text-5xl lg:text-7xl">
                Diseno Industrial <br className="hidden md:block" /> Personalizado
              </h3>

              <div className="w-full space-y-6 md:space-y-8">
                <p className="border-l-4 border-emerald-400 pl-6 text-lg font-medium leading-relaxed text-white md:text-xl">
                  Nuestra especializacion en mobiliario de estilo industrial nace del
                  equilibrio entre materialidad y uso. Fabricamos piezas disenadas para
                  perdurar, adaptandonos a las medidas y necesidades especificas de cada
                  espacio.
                </p>

                <p className="text-base font-light leading-relaxed text-neutral-400 md:text-lg">
                  Cada proyecto en Herreria Estudio es abordado con rigor tecnico.
                  Integramos estructuras metalicas soldadas con precision y tapas de
                  madera maciza seleccionada, aplicando acabados de alta resistencia como
                  powder coating y lacas protectoras, ideales tanto para el hogar como
                  para entornos comerciales de alta exigencia.
                </p>

                <p className="text-base font-light leading-relaxed text-neutral-400 md:text-lg">
                  Optimizamos cada ensamble para lograr una estetica minimalista sin
                  sacrificar la robustez. Al trabajar de forma personalizada, permitimos
                  a nuestros clientes y arquitectos definir dimensiones, tonalidades y
                  configuraciones, resultando en muebles que son verdaderas soluciones
                  espaciales.
                </p>

                <div className="mt-14 grid grid-cols-1 gap-6 border-y border-white/10 py-3 sm:grid-cols-2">
                  <div>
                    <span className="block text-2xl font-light text-white">01. Funcionalidad</span>
                    <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                      Diseno para el uso
                    </p>
                  </div>
                  <div>
                    <span className="block text-2xl font-light text-white">02. Materialidad</span>
                    <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                      Hierro y madera noble
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-6 py-16 sm:px-8 md:py-14 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl font-light leading-[1.1] tracking-tighter text-white md:text-5xl">
              Nuestros Principios
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {[
              {
                title: "Materia Honesta",
                description:
                  "Trabajamos hierro y acero con terminaciones simples, honestas y duraderas. La materia es el mensaje.",
              },
              {
                title: "Precision",
                description:
                  "Cada estructura se resuelve con proporciones claras y una ejecucion cuidada al detalle.",
              },
              {
                title: "Escala Humana",
                description:
                  "Disenamos para el uso real, el ritmo cotidiano y los espacios que habitamos.",
              },
            ].map((value, index) => (
              <div key={index} className="space-y-4 border-l-2 border-white/10 pl-6">
                <h3 className="text-xl font-light tracking-tight text-white md:text-2xl">
                  {value.title}
                </h3>
                <p className="text-base font-light leading-relaxed text-neutral-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
