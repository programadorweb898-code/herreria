import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center sm:px-8">
      <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">404</p>
      <h1 className="text-4xl font-semibold uppercase tracking-tight">Página no encontrada</h1>
      <p className="max-w-xl text-base font-light leading-8 text-slate-600">
        La página que buscás no está disponible o fue movida.
      </p>
      <Link
        className="border border-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-accent hover:text-accent"
        href="/"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
