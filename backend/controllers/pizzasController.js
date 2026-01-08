import { getFirestore } from 'firebase-admin/firestore'

const db = getFirestore()

function isPizzaCategory(value) {
  return value === 'Meat' || value === 'Veggie' || value === 'Spicy'
}

/**
 * Отримати всі піци
 */
export async function getPizzas(req, res) {
  try {
    const snap = await db.collection('pizzas').get()
    const pizzas = snap.docs.map((d) => {
      const data = d.data()

      const title = String(data.title ?? '')
      const description = String(data.description ?? '')
      const price = Number(data.price ?? 0)
      const imageUrl = String(data.imageUrl ?? '')
      const categoryRaw = data.category
      const category = isPizzaCategory(categoryRaw) ? categoryRaw : 'Meat'
      const discountPercent = data.discountPercent != null ? Number(data.discountPercent) : undefined

      return {
        id: d.id,
        title,
        description,
        price,
        imageUrl,
        category,
        ...(discountPercent ? { discountPercent } : {}),
      }
    })

    res.json(pizzas)
  } catch (error) {
    console.error('Помилка отримання піц:', error)
    res.status(500).json({ error: 'Failed to fetch pizzas' })
  }
}

/**
 * Отримати піцу за ID
 */
export async function getPizzaById(req, res) {
  try {
    const { id } = req.params
    const doc = await db.collection('pizzas').doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Pizza not found' })
    }

    const data = doc.data()

    const title = String(data.title ?? '')
    const description = String(data.description ?? '')
    const price = Number(data.price ?? 0)
    const imageUrl = String(data.imageUrl ?? '')
    const categoryRaw = data.category
    const category = isPizzaCategory(categoryRaw) ? categoryRaw : 'Meat'
    const discountPercent = data.discountPercent != null ? Number(data.discountPercent) : undefined

    res.json({
      id: doc.id,
      title,
      description,
      price,
      imageUrl,
      category,
      ...(discountPercent ? { discountPercent } : {}),
    })
  } catch (error) {
    console.error('Помилка отримання піци:', error)
    res.status(500).json({ error: 'Failed to fetch pizza' })
  }
}

