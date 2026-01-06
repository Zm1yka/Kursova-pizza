import { Button } from '../ui/Button'
import type { Drink } from '../../types/drink'
import { useCart } from '../../hooks/useCart'
import { PizzaImage } from '../pizza/PizzaImage'

export function DrinkCard({ drink }: { drink: Drink }) {
  const { addDrink } = useCart()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 sm:h-52 bg-slate-100">
        {drink.imageUrl ? (
          <PizzaImage imageUrl={drink.imageUrl} alt={drink.title} className="h-full w-full object-cover block" />
        ) : null}
        {!drink.imageUrl ? (
          <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
            Немає зображення
          </div>
        ) : null}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="font-semibold leading-tight text-slate-900 line-clamp-2 min-h-[2.5rem]">
              {drink.title}
            </div>
            {drink.volume ? (
              <div className="text-xs text-slate-500 mt-0.5">{drink.volume} мл</div>
            ) : null}
          </div>
          <div className="font-semibold whitespace-nowrap text-slate-900">{drink.price.toFixed(2)} ₴</div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">{drink.description}</p>

        <div className="pt-2 mt-auto">
          <Button onClick={() => addDrink(drink)} className="w-full">
            Додати в кошик
          </Button>
        </div>
      </div>
    </div>
  )
}

