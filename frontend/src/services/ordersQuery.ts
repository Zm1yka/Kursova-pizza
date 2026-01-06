import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebase'

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

export async function fetchOrdersByUser(userId: string): Promise<OrderDoc[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', userId))
  const snap = await getDocs(q)
  const orders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, 'id'>) }))
  orders.sort((a, b) => {
    const ta = (a.timestamp as { toMillis?: () => number } | null | undefined)?.toMillis?.() ?? 0
    const tb = (b.timestamp as { toMillis?: () => number } | null | undefined)?.toMillis?.() ?? 0
    return tb - ta
  })
  return orders
}

export async function fetchOrderById(orderId: string): Promise<OrderDoc | null> {
  const snap = await getDoc(doc(db, 'orders', orderId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<OrderDoc, 'id'>) }
}


