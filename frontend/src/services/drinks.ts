import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { Drink } from '../types/drink'

/**
 * Отримання напоїв з колекції Firestore `drinks`.
 */
export async function fetchDrinks(): Promise<Drink[]> {
  const snap = await getDocs(collection(db, 'drinks'))
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>

    const title = String(data.title ?? '')
    const description = String(data.description ?? '')
    const price = Number(data.price ?? 0)
    const imageUrl = String(data.imageUrl ?? '')
    const volume = data.volume != null ? Number(data.volume) : undefined

    return {
      id: d.id,
      title,
      description,
      price,
      imageUrl,
      ...(volume ? { volume } : {}),
    }
  })
}

