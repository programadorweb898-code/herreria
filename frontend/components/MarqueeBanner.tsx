const items = [
  "Envíos a todo el país",
  "Consultas por WhatsApp",
  "Diseño a medida",
];

export default function MarqueeBanner() {
  const content = [...items, ...items, ...items];

  return (
    <section className="overflow-hidden border-y border-border bg-[#f3f3f1] py-4">
      <div className="marquee-track flex min-w-max gap-10 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground">
        {content.map((item, index) => (
          <span className="flex items-center gap-10" key={`${item}-${index}`}>
            <span>{item}</span>
            <span className="text-slate-400">/</span>
          </span>
        ))}
      </div>
    </section>
  );
}
