"use client";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({
  phone,
  message,
  className,
  children,
}: WhatsAppButtonProps) {
  const normalizedPhone = phone.replace(/\D/g, "");
  const href = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      className={[
        "inline-flex items-center justify-center gap-2 border border-foreground px-5 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase transition hover:border-accent hover:text-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 21a8.55 8.55 0 0 1-4.22-1.12L3.5 21l1.16-4.12A8.42 8.42 0 0 1 3.5 12C3.5 7.31 7.31 3.5 12 3.5S20.5 7.31 20.5 12 16.69 20.5 12 20.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9.34 8.6c.16-.36.33-.37.48-.38h.42c.14 0 .37.05.56.46.18.41.62 1.42.67 1.52.05.1.08.23.02.36-.06.13-.1.21-.2.32-.1.11-.2.24-.28.32-.1.1-.2.2-.08.39.11.18.5.82 1.08 1.33.74.65 1.36.85 1.55.95.19.09.3.08.42-.05.11-.13.46-.53.58-.71.13-.18.26-.15.43-.09.18.06 1.12.53 1.31.62.19.1.32.15.37.24.05.1.05.56-.13 1.1-.18.54-1.03 1.03-1.42 1.08-.36.05-.82.07-1.33-.1a7.77 7.77 0 0 1-2.32-1.42A8.56 8.56 0 0 1 8.8 12.3c-.31-.54-.64-1.53-.28-2.23.17-.34.37-.95.82-1.47Z"
          fill="currentColor"
        />
      </svg>
      {children ?? "Consultar por WhatsApp"}
    </a>
  );
}
