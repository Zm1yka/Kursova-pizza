import { apiGet } from './api'
import type { Pizza } from '../types/pizza'

export async function fetchPizzas(): Promise<Pizza[]> {
  return await apiGet('/pizzas')
}

export async function fetchPizzaById(id: string): Promise<Pizza | null> {
  try {
    return await apiGet(`/pizzas/${id}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}


