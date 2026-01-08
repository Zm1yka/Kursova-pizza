import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const db = getFirestore()

/**
 * Отримати кошик користувача
 */
export async function getCart(req, res) {
  try {
    const { uid } = req.user

    const cartDoc = await db.collection('carts').doc(uid).get()

    if (!cartDoc.exists) {
      return res.json({ items: [] })
    }

    const cartData = cartDoc.data()
    const items = cartData.items || []

    // Оновлюємо дані товарів з актуальними цінами
    const refreshedItems = await Promise.all(
      items.map(async (item) => {
        if (item.pizza) {
          try {
            const pizzaDoc = await db.collection('pizzas').doc(item.pizza.id).get()
            if (pizzaDoc.exists) {
              const pizzaData = pizzaDoc.data()
              return {
                ...item,
                pizza: {
                  id: pizzaDoc.id,
                  title: String(pizzaData.title ?? ''),
                  description: String(pizzaData.description ?? ''),
                  price: Number(pizzaData.price ?? 0),
                  imageUrl: String(pizzaData.imageUrl ?? ''),
                  category: pizzaData.category || 'Meat',
                  ...(pizzaData.discountPercent != null ? { discountPercent: Number(pizzaData.discountPercent) } : {}),
                },
              }
            }
          } catch (error) {
            console.warn('Не вдалося оновити дані піци:', error)
          }
        } else if (item.drink) {
          try {
            const drinkDoc = await db.collection('drinks').doc(item.drink.id).get()
            if (drinkDoc.exists) {
              const drinkData = drinkDoc.data()
              return {
                ...item,
                drink: {
                  id: drinkDoc.id,
                  title: String(drinkData.title ?? ''),
                  description: String(drinkData.description ?? ''),
                  price: Number(drinkData.price ?? 0),
                  imageUrl: String(drinkData.imageUrl ?? ''),
                  ...(drinkData.volume != null ? { volume: Number(drinkData.volume) } : {}),
                },
              }
            }
          } catch (error) {
            console.warn('Не вдалося оновити дані напою:', error)
          }
        }
        return item
      }),
    )

    res.json({ items: refreshedItems })
  } catch (error) {
    console.error('Помилка отримання кошика:', error)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}

/**
 * Оновити кошик користувача
 */
export async function updateCart(req, res) {
  try {
    const { uid } = req.user
    const { items } = req.body

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' })
    }

    await db.collection('carts').doc(uid).set(
      {
        items,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    res.json({ success: true, items })
  } catch (error) {
    console.error('Помилка оновлення кошика:', error)
    res.status(500).json({ error: 'Failed to update cart' })
  }
}

/**
 * Очистити кошик користувача
 */
export async function clearCart(req, res) {
  try {
    const { uid } = req.user

    await db.collection('carts').doc(uid).set(
      {
        items: [],
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    res.json({ success: true, items: [] })
  } catch (error) {
    console.error('Помилка очищення кошика:', error)
    res.status(500).json({ error: 'Failed to clear cart' })
  }
}

