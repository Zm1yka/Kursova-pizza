import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { Pizza, PizzaCategory } from '../types/pizza'

function isPizzaCategory(value: unknown): value is PizzaCategory {
  return value === 'Meat' || value === 'Veggie' || value === 'Spicy'
}

/**
 * Отримання піц з колекції Firestore `pizzas`.
 * Документи повинні містити: title, description, price, imageUrl, category.
 */
export async function fetchPizzas(): Promise<Pizza[]> {
  const snap = await getDocs(collection(db, 'pizzas'))
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>

    const title = String(data.title ?? '')
    const description = String(data.description ?? '')
    const price = Number(data.price ?? 0)
    const imageUrl = String(data.imageUrl ?? '')
    const categoryRaw = data.category
    const category: PizzaCategory = isPizzaCategory(categoryRaw) ? categoryRaw : 'Meat'
    const discountPercent = data.discountPercent != null ? Number(data.discountPercent) : undefined

    return { id: d.id, title, description, price, imageUrl, category, ...(discountPercent ? { discountPercent } : {}) }
  })
}

/**
 * Отримання однієї піци за id з Firestore `pizzas/{id}`.
 */
export async function fetchPizzaById(id: string): Promise<Pizza | null> {
  const snap = await getDoc(doc(db, 'pizzas', id))
  if (!snap.exists()) return null
  const data = snap.data() as Record<string, unknown>

  const title = String(data.title ?? '')
  const description = String(data.description ?? '')
  const price = Number(data.price ?? 0)
  const imageUrl = String(data.imageUrl ?? '')
  const categoryRaw = data.category
  const category: PizzaCategory = isPizzaCategory(categoryRaw) ? categoryRaw : 'Meat'
  const discountPercent = data.discountPercent != null ? Number(data.discountPercent) : undefined

  return { id: snap.id, title, description, price, imageUrl, category, ...(discountPercent ? { discountPercent } : {}) }
}


