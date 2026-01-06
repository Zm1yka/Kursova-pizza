import { useEffect, useState } from 'react'
import type { Drink } from '../types/drink'
import { fetchDrinks } from '../services/drinks'

type UseDrinksState = {
  drinks: Drink[]
  loading: boolean
  error: string | null
}

/**
 * Кастомний hook для отримання напоїв з Firestore.
 */
export function useDrinks(): UseDrinksState {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDrinks()
        if (!alive) return
        setDrinks(data)
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Помилка завантаження напоїв')
      } finally {
        if (alive) setLoading(false)
      }
    }

    void run()
    return () => {
      alive = false
    }
  }, [])

  return { drinks, loading, error }
}

