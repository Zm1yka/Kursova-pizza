import { useEffect, useMemo, useState } from 'react'

export type NewsSlide = {
  title: string
  subtitle: string
  imageUrl: string
}

type Props = {
  slides: NewsSlide[]
  intervalMs?: number
}

export function NewsCarousel({ slides, intervalMs = 10_000 }: Props) {
  const safeSlides = useMemo(() => slides.filter((s) => s.imageUrl), [slides])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (safeSlides.length <= 1) return
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % safeSlides.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [safeSlides.length, intervalMs])

  if (!safeSlides.length) return null

  const current = safeSlides[idx]!

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="relative h-72 sm:h-96 bg-slate-100">
        <img src={current.imageUrl} alt={current.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white">
            Новини / Акції
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-semibold text-white">{current.title}</div>
          <div className="mt-1 text-sm text-white/85 max-w-2xl">{current.subtitle}</div>

          <div className="mt-5 flex items-center gap-2">
            {safeSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Перейти до слайду ${i + 1}`}
                onClick={() => setIdx(i)}
                className={[
                  'h-2.5 rounded-full transition',
                  i === idx ? 'w-8 bg-orange-500' : 'w-2.5 bg-white/60 hover:bg-white/80',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


