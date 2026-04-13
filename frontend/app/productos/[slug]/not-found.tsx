import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center sm:px-8">
      <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">Producto</p>
      <h1 className="text-4xl font-semibold uppercase tracking-tight">Producto no encontrado</h1>
      <p className="max-w-xl text-base font-light leading-8 text-slate-600">
        No encontramos la pieza que buscás. Podés volver al catálogo y explorar otras opciones.
      </p>
      <Link
        className="border border-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-accent hover:text-accent"
        href="/productos"
      >
        Volver a productos
      </Link>
    </div>
  );
}
