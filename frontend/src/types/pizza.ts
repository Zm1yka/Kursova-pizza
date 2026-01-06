export type PizzaCategory = 'Meat' | 'Veggie' | 'Spicy'

export type Pizza = {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  category: PizzaCategory
  discountPercent?: number
}


