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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-[#f7f7f5]/95 text-black backdrop-blur-sm"
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
              className={`text-black transition-colors hover:text-black/60 ${
                pathname === link.href ? "font-bold" : ""
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
            className="hidden sm:flex border border-black px-4 py-2 text-[10px] text-black hover:border-black/70 hover:text-black/70"
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
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-2 translate-y-[-50%] rotate-45" : ""
                }`} 
              />
              <span 
                className={`absolute left-0 top-2 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`} 
              />
              <span 
                className={`absolute left-0 bottom-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "bottom-2 translate-y-[50%] -rotate-45" : ""
                }`} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "max-h-[500px] border-t border-border" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-8 p-8 text-[11px] font-light uppercase tracking-[0.24em]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-black transition-colors hover:text-black/60"
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppButton
            className="w-full justify-center border border-black px-6 py-4 text-[10px] text-black"
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
