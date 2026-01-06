import { useEffect, useState } from 'react'

type Props = {
  imageUrl: string
  alt: string
  className?: string
}

export function PizzaImage({ imageUrl, alt, className }: Props) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function run() {
      if (!imageUrl) {
        if (alive) setSrc(null)
        return
      }
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        if (alive) setSrc(imageUrl)
        return
      }
      if (imageUrl.startsWith('/')) {
        const pathParts = imageUrl.split('/')
        const filename = pathParts.pop()
        const dir = pathParts.join('/')
        const encodedPath = filename ? `${dir}/${encodeURIComponent(filename)}` : imageUrl
        if (alive) setSrc(encodedPath)
        return
      }
      if (imageUrl.startsWith('tmp/')) {
        const fullPath = `/${imageUrl}`
        const pathParts = fullPath.split('/')
        const filename = pathParts.pop()
        const dir = pathParts.join('/')
        const encodedPath = filename ? `${dir}/${encodeURIComponent(filename)}` : fullPath
        if (alive) setSrc(encodedPath)
        return
      }
      if (alive) setSrc(null)
    }

    run()
    return () => {
      alive = false
    }
  }, [imageUrl])

  if (!src) return null
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
}


