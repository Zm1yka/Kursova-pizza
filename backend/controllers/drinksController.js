import { getFirestore } from 'firebase-admin/firestore'

const db = getFirestore()

/**
 * Отримати всі напої
 */
export async function getDrinks(req, res) {
  try {
    const snap = await db.collection('drinks').get()
    const drinks = snap.docs.map((d) => {
      const data = d.data()

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

    res.json(drinks)
  } catch (error) {
    console.error('Помилка отримання напоїв:', error)
    res.status(500).json({ error: 'Failed to fetch drinks' })
  }
}

