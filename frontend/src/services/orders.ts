import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { CartItem } from '../context/CartContext'

export type CreateOrderInput = {
  userId: string
  items: CartItem[]
  totalAmount: number
  status?: 'new' | 'paid' | 'done' | 'cancelled'
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

/**
 * Створення документа замовлення в колекції Firestore `orders`.
 * Схема: { userId, items, totalAmount, timestamp }
 */
export async function createOrder({
  userId,
  items,
  totalAmount,
  delivery,
  payment,
  status = 'new',
}: CreateOrderInput) {
  // Очищаємо undefined значення, замінюємо на null або видаляємо поле
  const cleanDelivery = delivery
    ? {
        name: delivery.name,
        phone: delivery.phone,
        address: delivery.address,
        ...(delivery.comment ? { comment: delivery.comment } : {}),
      }
    : null

  // Очищаємо payment об'єкт від undefined значень
  const cleanPayment = payment
    ? {
        method: payment.method,
        ...(payment.cardLast4 ? { cardLast4: payment.cardLast4 } : {}),
      }
    : null

  const payload = {
    userId,
    totalAmount,
    status,
    timestamp: serverTimestamp(),
    delivery: cleanDelivery,
    payment: cleanPayment,
    items: items.map((i) => {
      if (i.pizza) {
        // Розрахунок ціни зі знижкою, якщо застосовується
        const pizzaPrice = i.pizza.discountPercent
          ? (i.pizza.price * (100 - i.pizza.discountPercent)) / 100
          : i.pizza.price
        return {
          key: i.key,
          type: 'pizza' as const,
          pizzaId: i.pizza.id,
          title: i.pizza.title,
          price: pizzaPrice, // Зберігаємо ціну зі знижкою
          quantity: i.quantity,
          imageUrl: i.pizza.imageUrl,
          category: i.pizza.category,
          toppings: i.toppings.map((t) => ({ id: t.id, title: t.title, price: t.price })),
        }
      } else if (i.drink) {
        return {
          key: i.key,
          type: 'drink' as const,
          drinkId: i.drink.id,
          title: i.drink.title,
          price: i.drink.price,
          quantity: i.quantity,
          imageUrl: i.drink.imageUrl,
          ...(i.drink.volume ? { volume: i.drink.volume } : {}),
        }
      }
      throw new Error('Cart item must have either pizza or drink')
    }),
  }

  return await addDoc(collection(db, 'orders'), payload)
}


