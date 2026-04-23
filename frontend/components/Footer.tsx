import Link from "next/link";

const links = [
  { href: "/productos", label: "Nuestros trabajos" },
  { href: "/nosotros", label: "Quiénes somos" },
  { href: "/diseno-personalizado", label: "Diseño personalizado" },
  { href: "/showroom", label: "Showroom" },
];

const socialLinks = [
  { 
    href: "https://wa.me/5491167894523", 
    label: "WhatsApp",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.326 0-2.617.321-3.833.94-1.149.583-2.19 1.408-3.044 2.442C3.921 10.863 3.5 12.137 3.5 13.5c0 1.485.376 2.898 1.086 4.11l-1.14 3.828 3.983-1.119c1.151.641 2.48 1.028 3.971 1.028h.004c1.326 0 2.617-.321 3.833-.94 1.149-.583 2.19-1.408 3.044-2.442.855-1.034 1.276-2.308 1.276-3.661 0-1.485-.376-2.898-1.086-4.11.71-1.212 1.086-2.625 1.086-4.11 0-1.462-.421-2.736-1.276-3.77-.854-1.034-1.895-1.859-3.044-2.442-1.216-.619-2.507-.94-3.833-.94z" />
      </svg>
    )
  },
  { 
    href: "https://instagram.com/herreria.estudio", 
    label: "Instagram",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.756 0 8.331.012 7.052.07 2.696.278.278 2.579.07 7.052.012 8.332 0 8.757 0 12s.012 3.668.07 4.948c.208 4.474 2.626 6.875 7.052 7.083 1.28.058 1.705.07 4.948.07 3.244 0 3.668-.012 4.948-.07 4.427-.208 6.851-2.626 7.059-7.083.058-1.28.07-1.705.07-4.948 0-3.244-.012-3.668-.07-4.948-.208-4.474-2.629-6.875-7.059-7.083C15.668.012 15.244 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
      </svg>
    )
  },
  { 
    href: "mailto:info@herreria-estudio.com", 
    label: "Email",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    )
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-[#f3f3f1]">
      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 border-b border-border pb-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Link className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em]" href="/">
              Herrería Estudio
            </Link>
            <p className="max-w-xs text-[11px] font-light uppercase leading-6 tracking-[0.22em] text-slate-500">
              Precisión material.
              <br />
              Objetos metálicos atemporales.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground">
                Navegación
              </p>
              <nav className="flex flex-col gap-3 text-[11px] font-light uppercase tracking-[0.2em] text-slate-500">
                {links.map((link) => (
                  <Link className="transition hover:text-foreground" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground">
                Contacto
              </p>
              <div className="flex flex-col gap-3">
                {socialLinks.map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 transition hover:text-foreground"
                    title={social.label}
                  >
                    {social.icon}
                    <span className="text-[11px] font-light uppercase tracking-[0.2em]">
                      {social.label === "WhatsApp" && "+54 9 (11) 6789-4523"}
                      {social.label === "Instagram" && "@herreria.estudio"}
                      {social.label === "Email" && "info@herreria-estudio.com"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground">
                Estudio
              </p>
              <div className="flex flex-col gap-3 text-[11px] font-light uppercase tracking-[0.2em] text-slate-500">
                <span>Buenos Aires</span>
                <span>Lunes a viernes</span>
                <span>09:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[10px] font-light uppercase tracking-[0.22em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Herrería Estudio. Hierro arquitectónico.</span>
          <span>Diseño a medida y series limitadas.</span>
        </div>
      </div>
    </footer>
  );
}
