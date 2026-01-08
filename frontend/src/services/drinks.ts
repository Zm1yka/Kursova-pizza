import { apiGet } from './api'
import type { Drink } from '../types/drink'

export async function fetchDrinks(): Promise<Drink[]> {
  return await apiGet('/drinks')
}

