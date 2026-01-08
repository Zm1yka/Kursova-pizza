import { apiGet } from './api'

export type OrderDoc = {
  id: string
  userId: string
  totalAmount: number
  timestamp?: unknown
  status?: string
  items: Array<{
    type?: 'pizza' | 'drink'
    title: string
    quantity: number
    price: number
    imageUrl?: string
    toppings?: Array<{ title: string; price: number }>
    volume?: number
  }>
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

export async function fetchOrdersByUser(_userId?: string): Promise<OrderDoc[]> {
  // userId більше не потрібен, оскільки визначається на backend через токен
  return await apiGet('/orders')
}

export async function fetchOrderById(orderId: string): Promise<OrderDoc | null> {
  try {
    return await apiGet(`/orders/${orderId}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}


