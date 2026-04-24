"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import WhatsAppButton from "@/components/WhatsAppButton";

const links = [
  { href: "/productos", label: "Nuestros trabajos" },
  { href: "/nosotros", label: "Quiénes somos" },
  { href: "/diseno-personalizado", label: "Diseño personalizado" },
  { href: "/showroom", label: "Showroom" },
  { href: "#footer", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/95 text-white backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        <Link
          className="text-sm font-semibold uppercase tracking-[0.34em] transition-opacity hover:opacity-70"
          href="/"
        >
          Herrería Estudio
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-[10px] font-light uppercase tracking-[0.24em] lg:flex">
          {links.map((link) => (
            <Link
              className={`text-white/60 transition-colors hover:text-emerald-400 ${
                pathname === link.href ? "text-emerald-400 font-bold" : ""
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <WhatsAppButton
            className="hidden sm:flex border border-emerald-500/50 bg-emerald-500/5 px-4 py-2 text-[10px] text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all"
            message="Hola! Me gustaría hacer una consulta."
            phone="+5491100000000"
          >
            WhatsApp
          </WhatsAppButton>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-8 w-8 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative h-4 w-5">
              <span 
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-white transition-all duration-300 ${
                  isMenuOpen ? "top-2 translate-y-[-50%] rotate-45" : ""
                }`} 
              />
              <span 
                className={`absolute left-0 top-2 h-[1.5px] w-full bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`} 
              />
              <span 
                className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-white transition-all duration-300 ${
                  isMenuOpen ? "bottom-2 translate-y-[50%] -rotate-45" : ""
                }`} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden bg-neutral-950 ${
          isMenuOpen ? "max-h-[500px] border-t border-white/5" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-8 p-8 text-[11px] font-light uppercase tracking-[0.24em]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-white/70 transition-colors hover:text-emerald-400 ${
                pathname === link.href ? "text-emerald-400 font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppButton
            className="w-full justify-center border border-emerald-500/50 bg-emerald-500/5 px-6 py-4 text-[10px] text-emerald-400"
            message="Hola! Me gustaría hacer una consulta."
            phone="+5491100000000"
          >
            WhatsApp
          </WhatsAppButton>
        </nav>
      </div>
    </header>
  );
}
