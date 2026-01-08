import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const db = getFirestore()

/**
 * Створити замовлення
 */
export async function createOrder(req, res) {
  try {
    const { uid } = req.user
    const { items, totalAmount, delivery, payment, status = 'new' } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and must not be empty' })
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Valid totalAmount is required' })
    }

    const cleanDelivery = delivery
      ? {
          name: delivery.name,
          phone: delivery.phone,
          address: delivery.address,
          ...(delivery.comment ? { comment: delivery.comment } : {}),
        }
      : null

    const cleanPayment = payment
      ? {
          method: payment.method,
          ...(payment.cardLast4 ? { cardLast4: payment.cardLast4 } : {}),
        }
      : null

    const orderItems = items.map((i) => {
      if (i.pizza) {
        const pizzaPrice = i.pizza.discountPercent
          ? (i.pizza.price * (100 - i.pizza.discountPercent)) / 100
          : i.pizza.price
        return {
          key: i.key,
          type: 'pizza',
          pizzaId: i.pizza.id,
          title: i.pizza.title,
          price: pizzaPrice,
          quantity: i.quantity,
          imageUrl: i.pizza.imageUrl,
          category: i.pizza.category,
          toppings: i.toppings.map((t) => ({ id: t.id, title: t.title, price: t.price })),
        }
      } else if (i.drink) {
        return {
          key: i.key,
          type: 'drink',
          drinkId: i.drink.id,
          title: i.drink.title,
          price: i.drink.price,
          quantity: i.quantity,
          imageUrl: i.drink.imageUrl,
          ...(i.drink.volume ? { volume: i.drink.volume } : {}),
        }
      }
      throw new Error('Cart item must have either pizza or drink')
    })

    const orderData = {
      userId: uid,
      totalAmount,
      status,
      timestamp: FieldValue.serverTimestamp(),
      delivery: cleanDelivery,
      payment: cleanPayment,
      items: orderItems,
    }

    const docRef = await db.collection('orders').add(orderData)

    res.status(201).json({ id: docRef.id, ...orderData })
  } catch (error) {
    console.error('Помилка створення замовлення:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

/**
 * Отримати всі замовлення користувача
 */
export async function getUserOrders(req, res) {
  try {
    const { uid } = req.user

    const snap = await db.collection('orders').where('userId', '==', uid).get()

    const orders = snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        userId: data.userId,
        totalAmount: data.totalAmount,
        timestamp: data.timestamp,
        status: data.status || 'new',
        items: data.items || [],
        delivery: data.delivery || null,
        payment: data.payment || null,
      }
    })

    // Сортуємо за датою (найновіші спочатку)
    orders.sort((a, b) => {
      const ta = a.timestamp?.toMillis?.() ?? 0
      const tb = b.timestamp?.toMillis?.() ?? 0
      return tb - ta
    })

    res.json(orders)
  } catch (error) {
    console.error('Помилка отримання замовлень:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

/**
 * Отримати замовлення за ID
 */
export async function getOrderById(req, res) {
  try {
    const { uid } = req.user
    const { id } = req.params

    const orderDoc = await db.collection('orders').doc(id).get()

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const data = orderDoc.data()

    // Перевіряємо, що замовлення належить користувачу
    if (data.userId !== uid) {
      return res.status(403).json({ error: 'Forbidden: Order does not belong to user' })
    }

    res.json({
      id: orderDoc.id,
      userId: data.userId,
      totalAmount: data.totalAmount,
      timestamp: data.timestamp,
      status: data.status || 'new',
      items: data.items || [],
      delivery: data.delivery || null,
      payment: data.payment || null,
    })
  } catch (error) {
    console.error('Помилка отримання замовлення:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

