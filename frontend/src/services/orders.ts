import { apiPost } from './api'
import type { CartItem } from '../context/CartContext'

export type CreateOrderInput = {
  items: CartItem[]
  totalAmount: number
  status?: 'new' | 'paid' | 'done' | 'cancelled'
  delivery?: {
    name: string
    phone: string
    address: string
    comment?: string
  }
  payment?: {
    method: 'card' | 'cash'
    cardLast4?: string
  }
}

export async function createOrder({
  items,
  totalAmount,
  delivery,
  payment,
  status = 'new',
}: CreateOrderInput) {
  // userId більше не потрібен, оскільки визначається на backend через токен
  return await apiPost('/orders', {
    items,
    totalAmount,
    delivery,
    payment,
    status,
  })
}


