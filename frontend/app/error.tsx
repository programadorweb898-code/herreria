"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center sm:px-8">
      <p className="text-xs font-light uppercase tracking-[0.28em] text-accent">Error</p>
      <h1 className="text-4xl font-semibold uppercase tracking-tight">No pudimos cargar esta sección</h1>
      <p className="max-w-xl text-base font-light leading-8 text-slate-600">
        {error.message || "Ocurrió un problema inesperado. Intentá nuevamente en unos instantes."}
      </p>
      <button
        className="border border-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-accent hover:text-accent"
        onClick={() => reset()}
        type="button"
      >
        Reintentar
      </button>
    </div>
  );
}
