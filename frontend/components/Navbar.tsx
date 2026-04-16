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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent && !isMenuOpen
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

        {/* Desktop Nav */}
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
          <WhatsAppButton
            className={[
              "hidden sm:flex px-4 py-2 text-[10px]",
              transparent
                ? "border-white text-white hover:border-white/70 hover:text-white/70"
                : "bg-foreground text-[#f7f7f5] hover:border-foreground hover:bg-foreground/85 hover:text-white",
            ].join(" ")}
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 top-[72px] z-40 bg-[#f7f7f5] transition-transform duration-500 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-center gap-10 p-12 text-sm font-light uppercase tracking-[0.3em] text-foreground">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${pathname === link.href ? "text-accent" : "text-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppButton
            className="mt-4 w-full justify-center bg-foreground px-6 py-4 text-[10px] text-white"
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
