import WhatsAppButton from "@/components/WhatsAppButton";

const phone = "+5491167894523";
const message = "Hola! Me interesa solicitar un diseño personalizado.";

export const metadata = {
  title: "Diseño Personalizado | Herrería Estudio",
};

export default function DisenoPersonalizadoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-32 sm:px-8 sm:pb-24 lg:px-12">
      <div className="flex flex-col items-center gap-8 border border-border px-8 py-16 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">Diseño personalizado</p>
        <h1 className="max-w-3xl text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
          Crea tu pieza única a medida.
        </h1>

        <WhatsAppButton className="px-8 py-4" message={message} phone={phone}>
          Solicitar diseño
        </WhatsAppButton>

        <p className="max-w-2xl text-base font-light leading-8 text-slate-600 mt-8">
          Trabajamos con vos para diseñar y fabricar muebles y objetos metálicos que se adapten 
          perfectamente a tus necesidades y espacios. Desde materiales hasta dimensiones y acabados.
        </p>
      </div>

      <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Proceso</p>
          <p className="text-base font-light leading-8 text-slate-600">
            De lo conceptual a lo real. Asesoramiento completo desde la idea hasta la entrega final.
          </p>
        </div>
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Materiales</p>
          <p className="text-base font-light leading-8 text-slate-600">
            Hierro, acero, madera y acabados a tu elección. Calidad y precisión garantizadas.
          </p>
        </div>
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Tiempos</p>
          <p className="text-base font-light leading-8 text-slate-600">
            Cotización según proyecto. Fabricación y entrega con cronograma acordado.
          </p>
        </div>
      </div>
    </div>
  );
}
