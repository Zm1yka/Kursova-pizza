import { useEffect, useState } from 'react'
import type { Topping } from '../types/topping'
import { fetchToppings } from '../services/toppings'

type UseToppingsState = {
  toppings: Topping[]
  loading: boolean
  error: string | null
}

export function useToppings(): UseToppingsState {
  const [state, setState] = useState<UseToppingsState>({ toppings: [], loading: true, error: null })

  useEffect(() => {
    let alive = true

    async function run() {
      try {
        const toppings = await fetchToppings()
        if (!alive) return
        setState({ toppings, loading: false, error: null })
      } catch (e) {
        if (!alive) return
        setState({ toppings: [], loading: false, error: e instanceof Error ? e.message : 'Помилка завантаження' })
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [])

  return state
}


