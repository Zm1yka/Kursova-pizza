import { getFirestore } from 'firebase-admin/firestore'

const db = getFirestore()

/**
 * Отримати всі додатки
 */
export async function getToppings(req, res) {
  try {
    const snap = await db.collection('toppings').get()
    const toppings = snap.docs
      .map((d) => {
        const data = d.data()
        return {
          id: d.id,
          title: String(data.title ?? ''),
          price: Number(data.price ?? 0),
          imageUrl: String(data.imageUrl ?? ''),
        }
      })
      .filter((t) => t.title && Number.isFinite(t.price) && t.imageUrl)

    res.json(toppings)
  } catch (error) {
    console.error('Помилка отримання додатків:', error)
    res.status(500).json({ error: 'Failed to fetch toppings' })
  }
}

