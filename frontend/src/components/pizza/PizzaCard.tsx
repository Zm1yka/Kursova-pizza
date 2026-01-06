import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import type { Pizza } from '../../types/pizza'
import { useCart } from '../../hooks/useCart'
import { PizzaImage } from './PizzaImage'

const categoryLabel: Record<Pizza['category'], string> = {
  Meat: "М'ясна",
  Veggie: 'Овочева',
  Spicy: 'Гостра',
}

export function PizzaCard({ pizza }: { pizza: Pizza }) {
  const { addItem } = useCart()
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <NavLink to={`/pizza/${pizza.id}`} className="block">
        <div className="h-48 sm:h-52 bg-slate-100">
          {pizza.imageUrl ? (
            <PizzaImage imageUrl={pizza.imageUrl} alt={pizza.title} className="h-full w-full object-cover block" />
          ) : null}
          {!pizza.imageUrl ? (
            <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
              Немає зображення
            </div>
          ) : null}
        </div>
      </NavLink>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <NavLink to={`/pizza/${pizza.id}`} className="block">
              <div className="font-semibold leading-tight text-slate-900 line-clamp-2 min-h-[2.5rem] hover:underline">
                {pizza.title}
              </div>
            </NavLink>
            <div className="text-xs text-slate-500 mt-0.5">{categoryLabel[pizza.category]}</div>
          </div>
          <div className="text-right">
            {pizza.discountPercent ? (
              <>
                <div className="text-xs text-orange-600 font-semibold mb-0.5">-{pizza.discountPercent}%</div>
                <div className="font-semibold whitespace-nowrap text-slate-900">
                  {((pizza.price * (100 - pizza.discountPercent)) / 100).toFixed(2)} ₴
                </div>
                <div className="text-xs text-slate-400 line-through">{pizza.price.toFixed(2)} ₴</div>
              </>
            ) : (
              <div className="font-semibold whitespace-nowrap text-slate-900">{pizza.price.toFixed(2)} ₴</div>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-3">{pizza.description}</p>

        <div className="pt-2 mt-auto">
          <Button onClick={() => addItem(pizza)} className="w-full">
            Додати в кошик
          </Button>
        </div>
      </div>
    </div>
  )
}


