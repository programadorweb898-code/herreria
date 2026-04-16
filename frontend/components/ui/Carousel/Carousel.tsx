'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { DotButton, PrevButton, NextButton } from './CarouselButtons'
import Image from 'next/image'

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
  autoplay?: boolean
}

const ProductCarousel: React.FC<PropType> = (props) => {
  const { slides, options, autoplay = true } = props
  
  // Plugins
  const plugins = autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : []
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative group max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl">
      {/* Contenedor de Embla */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((src, index) => (
            <div 
              className="relative flex-[0_0_100%] min-w-0 aspect-[16/9] sm:aspect-video" 
              key={index}
            >
              <Image
                src={src}
                alt={`Product slide ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botones de Navegación (Solo se muestran si hay más de 1 slide) */}
      {slides.length > 1 && (
        <>
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />

          {/* Indicadores (Dots) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                selected={index === selectedIndex}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductCarousel
