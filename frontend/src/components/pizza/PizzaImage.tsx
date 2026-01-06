import { useEffect, useState } from 'react'

type Props = {
  imageUrl: string
  alt: string
  className?: string
}

/**
 * Відображення зображення піци.
 * Підтримує:
 * - http(s) URL
 * - Локальні шляхи, що починаються з / (обслуговуються Vite з папки public)
 */
export function PizzaImage({ imageUrl, alt, className }: Props) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function run() {
      if (!imageUrl) {
        if (alive) setSrc(null)
        return
      }
      // HTTP/HTTPS URL адреси
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        if (alive) setSrc(imageUrl)
        return
      }
      // Локальні шляхи, що починаються з / (з папки public)
      if (imageUrl.startsWith('/')) {
        // Кодуємо тільки ім'я файлу для обробки кириличних символів
        const pathParts = imageUrl.split('/')
        const filename = pathParts.pop()
        const dir = pathParts.join('/')
        const encodedPath = filename ? `${dir}/${encodeURIComponent(filename)}` : imageUrl
        if (alive) setSrc(encodedPath)
        return
      }
      // Шляхи, що починаються з tmp/ - конвертуємо в /tmp/
      if (imageUrl.startsWith('tmp/')) {
        const fullPath = `/${imageUrl}`
        // Кодуємо тільки ім'я файлу для обробки кириличних символів
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


