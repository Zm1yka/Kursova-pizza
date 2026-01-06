import { createContext, useEffect, useMemo, useReducer, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Pizza } from '../types/pizza'
import type { Topping } from '../types/topping'
import type { Drink } from '../types/drink'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuth } from '../hooks/useAuth'
import { fetchPizzaById } from '../services/pizzas'
import { fetchDrinks } from '../services/drinks'

export type CartItem = {
  key: string
  pizza?: Pizza
  drink?: Drink
  toppings: Topping[]
  quantity: number
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_PIZZA'; pizza: Pizza; toppings: Topping[] }
  | { type: 'ADD_DRINK'; drink: Drink }
  | { type: 'REMOVE'; key: string }
  | { type: 'SET_QTY'; key: string; quantity: number }
  | { type: 'SET_ITEMS'; items: CartItem[] }
  | { type: 'CLEAR' }

function cartKey(pizzaId: string, toppings: Topping[]) {
  const ids = toppings.map((t) => t.id).sort()
  return ids.length ? `${pizzaId}::${ids.join(',')}` : pizzaId
}

function drinkKey(drinkId: string) {
  return `drink::${drinkId}`
}

function toppingsSum(toppings: Topping[]) {
  return toppings.reduce((sum, t) => sum + t.price, 0)
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_PIZZA': {
      const key = cartKey(action.pizza.id, action.toppings)
      const existing = state.items.find((i) => i.key === key)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { key, pizza: action.pizza, toppings: action.toppings, quantity: 1 }] }
    }
    case 'ADD_DRINK': {
      const key = drinkKey(action.drink.id)
      const existing = state.items.find((i) => i.key === key)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { key, drink: action.drink, toppings: [], quantity: 1 }] }
    }
    case 'REMOVE': {
      return { items: state.items.filter((i) => i.key !== action.key) }
    }
    case 'SET_QTY': {
      const quantity = Math.max(1, Math.floor(action.quantity))
      return {
        items: state.items.map((i) => (i.key === action.key ? { ...i, quantity } : i)),
      }
    }
    case 'CLEAR': {
      return { items: [] }
    }
    case 'SET_ITEMS': {
      return { items: action.items }
    }
  }
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  addItem: (pizza: Pizza, toppings?: Topping[]) => void
  addDrink: (drink: Drink) => void
  removeItem: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

const LS_KEY = 'pizzeria_cart_v1'

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const [hydrated, setHydrated] = useState(false)
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    let alive = true

    async function run() {
      try {
        let items: CartItem[] = []
        if (user) {
          const ref = doc(db, 'carts', user.uid)
          const snap = await getDoc(ref)
          items = (snap.exists() ? (snap.data().items as CartItem[] | undefined) : undefined) ?? []
        } else {
          items = safeParseCart(localStorage.getItem(LS_KEY))
        }

        if (!alive) return

        const refreshedItems: CartItem[] = await Promise.all(
          items.map(async (item) => {
            if (item.pizza) {
              try {
                const freshPizza = await fetchPizzaById(item.pizza.id)
                if (freshPizza) {
                  return { ...item, pizza: freshPizza }
                }
              } catch (e) {
                console.warn('Failed to refresh pizza data:', e)
              }
            } else if (item.drink) {
              try {
                const allDrinks = await fetchDrinks()
                const freshDrink = allDrinks.find((d) => d.id === item.drink!.id)
                if (freshDrink) {
                  return { ...item, drink: freshDrink }
                }
              } catch (e) {
                console.warn('Failed to refresh drink data:', e)
              }
            }
            return item
          }),
        )

        if (!alive) return
        dispatch({ type: 'SET_ITEMS', items: refreshedItems })
      } finally {
        if (alive) setHydrated(true)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [user?.uid])

  useEffect(() => {
    if (!hydrated) return

    if (!user) {
      localStorage.setItem(LS_KEY, JSON.stringify(state.items))
      return
    }

    const timeout = setTimeout(() => {
      void setDoc(
        doc(db, 'carts', user.uid),
        { items: state.items, updatedAt: serverTimestamp() },
        { merge: true },
      )
    }, 250)

    return () => clearTimeout(timeout)
  }, [hydrated, user?.uid, state.items])

  const totalItems = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items])
  
  const totalAmount = useMemo(() => {
    const getPizzaPrice = (pizza: Pizza): number => {
      if (pizza.discountPercent) {
        return (pizza.price * (100 - pizza.discountPercent)) / 100
      }
      return pizza.price
    }

    const allPizzas: Array<{ basePrice: number; toppingsPrice: number }> = []
    const allDrinks: Array<{ price: number }> = []
    
    for (const item of state.items) {
      if (item.pizza) {
        const basePrice = getPizzaPrice(item.pizza)
        const toppingsPrice = toppingsSum(item.toppings)
        for (let i = 0; i < item.quantity; i++) {
          allPizzas.push({ basePrice, toppingsPrice })
        }
      } else if (item.drink) {
        for (let i = 0; i < item.quantity; i++) {
          allDrinks.push({ price: item.drink!.price })
        }
      }
    }

    let total = 0
    for (let i = 0; i < allPizzas.length; i++) {
      const { basePrice, toppingsPrice } = allPizzas[i]
      const unitPrice = basePrice + toppingsPrice
      if (i % 2 === 1) {
        total += unitPrice * 0.85
      } else {
        total += unitPrice
      }
    }
    
    for (const drink of allDrinks) {
      total += drink.price
    }
    
    return total
  }, [state.items])

  const value: CartContextValue = useMemo(
    () => ({
      items: state.items,
      totalItems,
      totalAmount,
      addItem: (pizza, toppings = []) => dispatch({ type: 'ADD_PIZZA', pizza, toppings }),
      addDrink: (drink) => dispatch({ type: 'ADD_DRINK', drink }),
      removeItem: (key) => dispatch({ type: 'REMOVE', key }),
      setQuantity: (key, quantity) => dispatch({ type: 'SET_QTY', key, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, totalItems, totalAmount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


