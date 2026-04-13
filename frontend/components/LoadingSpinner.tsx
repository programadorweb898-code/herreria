export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        aria-label="Cargando"
        className="h-10 w-10 animate-spin rounded-full border border-border border-t-foreground"
        role="status"
      />
    </div>
  );
}
