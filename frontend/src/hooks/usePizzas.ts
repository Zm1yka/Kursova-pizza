import { useEffect, useState } from 'react'
import type { Pizza } from '../types/pizza'
import { fetchPizzas } from '../services/pizzas'

type UsePizzasState = {
  pizzas: Pizza[]
  loading: boolean
  error: string | null
}

/**
 * React hook для завантаження піц з Firestore.
 */
export function usePizzas(): UsePizzasState {
  const [state, setState] = useState<UsePizzasState>({ pizzas: [], loading: true, error: null })

  useEffect(() => {
    let alive = true

    async function run() {
      try {
        const pizzas = await fetchPizzas()
        if (!alive) return
        setState({ pizzas, loading: false, error: null })
      } catch (e) {
        if (!alive) return
        setState({ pizzas: [], loading: false, error: e instanceof Error ? e.message : 'Помилка завантаження' })
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [])

  return state
}


