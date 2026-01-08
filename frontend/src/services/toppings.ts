import { apiGet } from './api'
import type { Topping } from '../types/topping'

export async function fetchToppings(): Promise<Topping[]> {
  return await apiGet('/toppings')
}


