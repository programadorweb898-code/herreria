"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import WhatsAppButton from "@/components/WhatsAppButton";

const links = [
  { href: "/productos", label: "Nuestros trabajos" },
  { href: "/nosotros", label: "Quiénes somos" },
  { href: "/diseno-personalizado", label: "Diseño personalizado" },
  { href: "#footer", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent text-white"
          : "border-b border-border bg-[#f7f7f5]/95 text-foreground backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        <Link
          className="text-sm font-semibold uppercase tracking-[0.34em] transition-opacity hover:opacity-70"
          href="/"
        >
          Herrería Estudio
        </Link>

        <nav className="hidden items-center gap-8 text-[10px] font-light uppercase tracking-[0.24em] lg:flex">
          {links.map((link) => (
            <Link
              className={[
                "border-b pb-1 transition-colors",
                pathname === link.href
                  ? transparent
                    ? "border-white text-white"
                    : "border-foreground text-foreground"
                  : transparent
                    ? "border-transparent text-white/65 hover:text-white"
                    : "border-transparent text-slate-500 hover:text-foreground",
              ].join(" ")}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
              <rect height="8" stroke="currentColor" width="8" x="2" y="2" />
            </svg>
            <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4" stroke="currentColor" />
            </svg>
          </div>

          <WhatsAppButton
            className={[
              "px-4 py-2 text-[10px]",
              transparent
                ? "border-white text-white hover:border-white/70 hover:text-white/70"
                : "bg-foreground text-[#f7f7f5] hover:border-foreground hover:bg-foreground/85 hover:text-white",
            ].join(" ")}
            message="Hola! Me gustaría hacer una consulta."
            phone="+5491100000000"
          >
            WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </header>
  );
}
