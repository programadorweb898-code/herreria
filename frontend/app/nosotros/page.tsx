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
            Diseño, Hierro y Madera
          </h2>
          <div className="space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-slate-700">
              En Herrería Estudio, fusionamos la robustez del hierro industrial con la calidez de maderas nobles para crear piezas únicas. Concebimos el mobiliario como una extensión de la arquitectura del lugar, donde cada detalle responde a una necesidad funcional y estética.
            </p>
            <p className="text-base font-light leading-[1.8] text-slate-600">
              Nuestros procesos combinan la precisión técnica de la metalurgia con la sensibilidad del trabajo artesanal en madera. Desde bibliotecas modulares hasta mesas de gran porte, cada pieza es diseñada bajo estándares de excelencia, asegurando durabilidad y un lenguaje visual coherente.
            </p>
            <div className="pt-8 flex flex-col items-center">
              <div className="h-px w-24 bg-foreground mb-4"></div>
              <span className="font-semibold text-[10px] tracking-widest uppercase text-foreground">
                Mobiliario con Lenguaje Arquitectónico
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Ingeniería y Proceso */}
      <section className="py-16 md:py-24 lg:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="md:flow-root">
            {/* Image Container with Float */}
            <div className="relative w-full md:w-[45%] h-[500px] md:h-[700px] md:float-left md:mr-16 mb-10 md:mb-4 group">
              <Image
                alt="Proceso de diseño y fabricación - Herrería Estudio"
                className="w-full h-full object-cover shadow-2xl"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                src="/Gemini_Generated_Image_6fjvaz6fjvaz6fjv.png"
              />
              <div className="absolute inset-0 border-[15px] border-white/5 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm p-4 border-l-2 border-white">
                <p className="text-white text-[11px] font-light tracking-wider uppercase">
                  Desarrollo de Mobiliario a Medida e Industrial
                </p>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-slate-800">
              <h3 className="text-4xl md:text-5xl lg:text-7xl font-extralight tracking-tighter mb-10 leading-none text-foreground">
                Diseño Industrial <br className="hidden md:block" /> Personalizado
              </h3>
              
              <div className="space-y-6 md:space-y-8 max-w-3xl">
                <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-900 border-l-4 border-foreground pl-6">
                  Nuestra especialización en mobiliario de estilo industrial nace del equilibrio entre materialidad y uso. Fabricamos piezas diseñadas para perdurar, adaptándonos a las medidas y necesidades específicas de cada espacio.
                </p>
                
                <p className="text-base md:text-lg font-light leading-relaxed text-slate-600">
                  Cada proyecto en Herrería Estudio es abordado con rigor técnico. Integramos estructuras metálicas soldadas con precisión y tapas de madera maciza seleccionada, aplicando acabados de alta resistencia como powder coating y lacas protectoras, ideales tanto para el hogar como para entornos comerciales de alta exigencia.
                </p>
                
                <p className="text-base md:text-lg font-light leading-relaxed text-slate-600">
                  Optimizamos cada ensamble para lograr una estética minimalista sin sacrificar la robustez. Al trabajar de forma personalizada, permitimos a nuestros clientes y arquitectos definir dimensiones, tonalidades y configuraciones, resultando en muebles que son verdaderas soluciones espaciales.
                </p>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100 mt-8">
                  <div>
                    <span className="block text-2xl font-light text-foreground">01. Funcionalidad</span>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">Diseño para el Uso</p>
                  </div>
                  <div>
                    <span className="block text-2xl font-light text-foreground">02. Materialidad</span>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">Hierro y Madera Noble</p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link 
                    href="/productos" 
                    className="inline-flex items-center gap-4 group text-foreground font-semibold text-[10px] tracking-widest uppercase"
                  >
                    <span className="bg-foreground text-white px-8 py-4 group-hover:bg-slate-800 transition-colors">
                      Ver Proyectos Industriales
                    </span>
                    <span className="h-px w-12 bg-foreground group-hover:w-20 transition-all"></span>
                  </Link>
                </div>
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
