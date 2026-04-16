import React, { PropsWithChildren } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type DotButtonProps = {
  selected: boolean
  onClick: () => void
}

export const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => {
  return (
    <button
      className={`relative w-3 h-3 rounded-full transition-all duration-300 border border-white/40 ${
        selected ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
      }`}
      type="button"
      onClick={onClick}
    />
  )
}

type PrevNextButtonProps = PropsWithChildren<{
  enabled: boolean
  onClick: () => void
}>

export const PrevButton: React.FC<PrevNextButtonProps> = ({ enabled, onClick }) => {
  return (
    <button
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={!enabled}
      type="button"
      aria-label="Previous slide"
    >
      <ChevronLeft size={24} />
    </button>
  )
}

export const NextButton: React.FC<PrevNextButtonProps> = ({ enabled, onClick }) => {
  return (
    <button
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={!enabled}
      type="button"
      aria-label="Next slide"
    >
      <ChevronRight size={24} />
    </button>
  )
}
