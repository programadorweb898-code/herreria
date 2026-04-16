'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

interface ProductImageCarouselProps {
  image: string;
  name: string;
  additionalImages?: string[];
}

export default function ProductImageCarousel({ image, name, additionalImages = [] }: ProductImageCarouselProps) {
  // Combine images
  const slides = additionalImages.length > 0 
    ? [image, ...additionalImages] 
    : [image, image, image];

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 30,
    align: 'start'
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full">
      <div className="group relative aspect-square border border-border bg-slate-100 overflow-hidden">
        {/* Contenedor de Embla */}
        <div className="h-full w-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full w-full">
            {slides.map((slide, index) => (
              <div key={index} className="relative h-full w-full flex-[0_0_100%] min-w-0 flex items-center justify-center">
                <div className="relative h-full w-full"> {/* 100% de ancho */}
                  <Image
                    alt={`${name} - Vista ${index + 1}`}
                    className="object-contain"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src={slide}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-foreground shadow-sm transition-opacity hover:bg-white focus:outline-none"
          aria-label="Anterior"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button 
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-foreground shadow-sm transition-opacity hover:bg-white focus:outline-none"
          aria-label="Siguiente"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-foreground w-6' : 'bg-border hover:bg-slate-400'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
