import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Quiénes somos | Herrería Estudio",
};

export default function QuienesSomosPage() {
  return (
    <div className="bg-white text-on-surface overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="relative w-full h-[550px] md:h-[700px] overflow-hidden bg-black flex items-end px-6 pb-12 sm:px-8 sm:pb-16 lg:px-12 lg:pb-24 pt-20">
        <Image
          alt="Herrería Estudio - Nuestra Historia"
          className="absolute inset-0 object-cover"
          fill
          priority
          sizes="100vw"
          src="/Gemini_Generated_Image_a4ph4a4ph4a4ph4a.png"
        />
        <div className="absolute inset-0 opacity-60">
          <div className="w-full h-full bg-gradient-to-b from-black/40 to-black/80"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-4xl">
            <span className="font-semibold text-[10px] tracking-widest uppercase text-white/60 block mb-4">
              HERRERÍA ESTUDIO
            </span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tighter leading-none">
              Nuestra Historia
            </h1>
          </div>
        </div>
      </section>

      {/* Section 2: Filosofía y Precisión */}
      <section className="py-16 md:py-24 lg:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter leading-[1.1] text-foreground mb-12">
            Filosofía y Precisión
          </h2>
          <div className="space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-slate-700">
              En el corazón de Herrería Estudio reside una obsesión por la honestidad del material. 
              Concebimos cada pieza como una estructura arquitectónica en miniatura, donde el hierro 
              y el acero no son solo un medio, sino el mensaje mismo de perdurabilidad y rigor técnico.
            </p>
            <p className="text-base font-light leading-[1.8] text-slate-600">
              Combinamos la fuerza bruta del procesamiento metal mecánico con la delicadeza del acabado 
              artesanal. Cada unión, cada pulido y cada arista es supervisada bajo estándares de precisión, 
              asegurando que la visión del diseñador se traduzca fielmente en una realidad táctil y eterna.
            </p>
            <div className="pt-8 flex flex-col items-center">
              <div className="h-px w-24 bg-foreground mb-4"></div>
              <span className="font-semibold text-[10px] tracking-widest uppercase text-foreground">
                EL HIERRO COMO LENGUAJE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Nuestra Misión */}
      <section className="pb-16 md:pb-24 lg:pb-32 px-6 sm:px-8 lg:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 items-stretch">
          {/* Left: Image */}
          <div className="bg-slate-100 overflow-hidden h-96 md:h-full min-h-[500px] relative">
            <Image
              alt="Proceso de fabricación - Herrería Estudio"
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/Gemini_Generated_Image_6fjvaz6fjvaz6fjv.png"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-foreground text-white">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tighter mb-8 md:mb-12 leading-tight">
              Nuestra Misión
            </h3>
            <div className="space-y-8 md:space-y-12">
              <div>
                <span className="block font-semibold text-[10px] tracking-widest uppercase text-white/50 mb-2">
                  COLABORACIÓN ESTRATÉGICA
                </span>
                <p className="text-base md:text-lg font-light leading-relaxed">
                  Actuamos como el brazo técnico de arquitectos y diseñadores. Nuestra misión es simple 
                  pero radical: eliminar las fricciones entre el concepto creativo y la ejecución física 
                  mediante el dominio del hierro y el acero.
                </p>
              </div>
              <div>
                <span className="block font-semibold text-[10px] tracking-widest uppercase text-white/50 mb-2">
                  PRECISIÓN SIN CONCESIONES
                </span>
                <p className="text-base md:text-lg font-light leading-relaxed">
                  Ofrecemos una infraestructura capaz de prototipar y producir mobiliario y elementos 
                  estructurales que desafían los límites de la manufactura convencional.
                </p>
              </div>
              <div className="pt-4">
                <Link 
                  href="/productos" 
                  className="inline-block bg-white text-foreground px-8 py-3 font-semibold text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all duration-100"
                >
                  Ver Nuestros Trabajos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Valores */}
      <section className="py-16 md:py-24 lg:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-light tracking-tighter leading-[1.1] text-foreground">
              Nuestros Principios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Materia Honesta",
                description:
                  "Trabajamos hierro y acero con terminaciones simples, honestas y duraderas. La materia es el mensaje.",
              },
              {
                title: "Precisión",
                description:
                  "Cada estructura se resuelve con proporciones claras y una ejecución cuidada al detalle.",
              },
              {
                title: "Escala Humana",
                description:
                  "Diseñamos para el uso real, el ritmo cotidiano y los espacios que habitamos.",
              },
            ].map((value, index) => (
              <div key={index} className="space-y-4 border-l-2 border-slate-200 pl-6">
                <h3 className="text-xl md:text-2xl font-light tracking-tight text-foreground">
                  {value.title}
                </h3>
                <p className="text-base font-light leading-relaxed text-slate-600">
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
