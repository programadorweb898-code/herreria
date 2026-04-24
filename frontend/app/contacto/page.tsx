import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";

const phone = "+5491100000000";
const message = "Hola! Me gustaría hacer una consulta.";

export const metadata = {
  title: "Contacto | Herrería Estudio",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-12 sm:px-8 sm:pb-24 lg:px-12">
      <div className="flex flex-col items-center gap-8 border border-border px-8 py-16 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">Contacto</p>
        <h1 className="max-w-3xl text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
          Hablemos sobre tu próxima pieza.
        </h1>
        <p className="max-w-2xl text-base font-light leading-8 text-slate-600">
          Escribinos para consultar stock, terminaciones, medidas especiales o desarrollar
          un mueble a medida para tu espacio.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <WhatsAppButton className="px-8 py-4 text-[11px]" message={message} phone={phone}>
            Abrir WhatsApp
          </WhatsAppButton>
          <Link
            href="/showroom"
            className="inline-flex items-center justify-center bg-black px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
          >
            Diseño personalizado
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Ubicación</p>
          <p className="text-base font-light leading-8 text-slate-600">Buenos Aires, Argentina</p>
        </div>
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Horarios</p>
          <p className="text-base font-light leading-8 text-slate-600">Lunes a viernes, 9 a 18 h</p>
        </div>
        <div className="bg-white p-8">
          <p className="mb-2 text-xs font-light uppercase tracking-[0.22em] text-accent">Email</p>
          <p className="text-base font-light leading-8 text-slate-600">hola@herreriaestudio.com</p>
        </div>
      </div>
    </div>
  );
}
