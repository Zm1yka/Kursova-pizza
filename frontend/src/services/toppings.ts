import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { Topping } from '../types/topping'

export async function fetchToppings(): Promise<Topping[]> {
  const snap = await getDocs(collection(db, 'toppings'))
  return snap.docs
    .map((d) => {
      const data = d.data() as Record<string, unknown>
      return {
        id: d.id,
        title: String(data.title ?? ''),
        price: Number(data.price ?? 0),
        imageUrl: String(data.imageUrl ?? ''),
      }
    })
    .filter((t) => t.title && Number.isFinite(t.price) && t.imageUrl)
}


