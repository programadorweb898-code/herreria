"use client";

import ProfessionalViewer from "@/components/ProfessionalViewer";
import InteractiveShowcase from "@/components/InteractiveShowcase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShowroomPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            3D Tech Showroom
          </h1>
          <p className="text-neutral-400 max-w-2xl">
            Explora nuestra nueva tecnología de renderizado 3D para herrería de alta gama. 
            Iluminación PBR, materiales realistas y sistemas interactivos.
          </p>
        </header>

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
              MODO INSPECTOR
            </span>
            <h2 className="text-2xl font-bold">Visor Profesional GLB</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ProfessionalViewer modelUrl="/models/bodega-milan.glb" />
            </div>
            <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/5 h-fit">
              <h3 className="font-bold mb-4 text-emerald-400">Características</h3>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>Mapeo de tonos ACES Filmic</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>Espacio de color sRGB correcto</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>Detección automática de jerarquía</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span>Auto-enfoque de cámara inteligente</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full border border-blue-500/20">
              MODO INTERACTIVO
            </span>
            <h2 className="text-2xl font-bold">Arquitectura de Objetos Dinámicos</h2>
          </div>
          <InteractiveShowcase />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold text-blue-400 mb-2">Animaciones GSAP</h4>
              <p className="text-sm text-neutral-400 text-pretty">Las puertas usan un sistema de pivotes reales para simular el comportamiento físico de un mueble.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold text-blue-400 mb-2">Objetos Procedurales</h4>
              <p className="text-sm text-neutral-400 text-pretty">Sistema preparado para inyectar modelos (como botellas) dinámicamente desde una base de datos.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-bold text-blue-400 mb-2">Performance Optimizada</h4>
              <p className="text-sm text-neutral-400 text-pretty">Sombras de contacto suaves (ContactShadows) que no penalizan el rendimiento en móviles.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
