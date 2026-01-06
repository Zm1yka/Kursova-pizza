import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'

export function CartPage() {
  const { items, totalAmount, removeItem, setQuantity, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Кошик</h1>
          <p className="text-sm text-slate-500">Змінюйте кількість та дивіться загальну суму.</p>
        </div>
        {items.length ? (
          <Button variant="ghost" size="sm" onClick={clear}>
            Очистити
          </Button>
        ) : null}
      </div>

      {!items.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Ваш кошик порожній.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.key}
                className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {it.pizza ? it.pizza.title : it.drink ? it.drink.title : 'Невідомий товар'}
                  </div>
                  <div className="text-sm text-slate-500">
                    {it.pizza
                      ? (() => {
                          const price = it.pizza.discountPercent
                            ? (it.pizza.price * (100 - it.pizza.discountPercent)) / 100
                            : it.pizza.price
                          return (
                            <div>
                              {price.toFixed(2)} ₴
                              {it.pizza.discountPercent ? (
                                <span className="ml-2 text-xs text-orange-600 font-semibold">
                                  -{it.pizza.discountPercent}%
                                </span>
                              ) : null}
                            </div>
                          )
                        })()
                      : it.drink
                        ? it.drink.price.toFixed(2) + ' ₴'
                        : '0.00 ₴'}
                  </div>
                  {it.pizza && it.toppings.length ? (
                    <div className="text-xs text-slate-500 mt-1">
                      Додатки: {it.toppings.map((t) => t.title).join(', ')}
                    </div>
                  ) : null}
                  {it.drink && it.drink.volume ? (
                    <div className="text-xs text-slate-500 mt-1">{it.drink.volume} мл</div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setQuantity(it.key, Math.max(1, it.quantity - 1))}
                  >
                    -
                  </Button>
                  <input
                    className="h-9 w-16 rounded-xl border border-slate-200 bg-white text-center text-sm outline-none shadow-sm focus:border-emerald-400"
                    value={it.quantity}
                    onChange={(e) => setQuantity(it.key, Number(e.target.value))}
                    inputMode="numeric"
                  />
                  <Button variant="secondary" size="sm" onClick={() => setQuantity(it.key, it.quantity + 1)}>
                    +
                  </Button>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="font-semibold whitespace-nowrap text-slate-900">
                    {it.pizza
                      ? (() => {
                          const pizzaPrice = it.pizza.discountPercent
                            ? (it.pizza.price * (100 - it.pizza.discountPercent)) / 100
                            : it.pizza.price
                          return (
                            it.quantity * (pizzaPrice + it.toppings.reduce((sum, t) => sum + t.price, 0))
                          ).toFixed(2)
                        })()
                      : it.drink
                        ? (it.quantity * it.drink.price).toFixed(2)
                        : '0.00'}{' '}
                    ₴
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(it.key)}>
                    Прибрати
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-4 h-fit shadow-sm">
            <div className="font-semibold text-slate-900">Підсумок</div>
            {(() => {
              const subtotal = items.reduce((sum, i) => {
                if (i.pizza) {
                  const pizzaPrice = i.pizza.discountPercent
                    ? (i.pizza.price * (100 - i.pizza.discountPercent)) / 100
                    : i.pizza.price
                  return sum + i.quantity * (pizzaPrice + i.toppings.reduce((s, t) => s + t.price, 0))
                } else if (i.drink) {
                  return sum + i.quantity * i.drink.price
                }
                return sum
              }, 0)
              const discount = subtotal - totalAmount
              const hasDiscount = discount > 0.01

              return (
                <>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>Товари</span>
                    <span>{subtotal.toFixed(2)} ₴</span>
                  </div>
                  {hasDiscount ? (
                    <div className="mt-2 flex items-center justify-between text-sm text-orange-600">
                      <span>Знижка "2-га піца -15%"</span>
                      <span className="font-semibold">-{discount.toFixed(2)} ₴</span>
                    </div>
                  ) : null}
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-base">
                    <span className="font-semibold text-slate-900">Разом</span>
                    <span className="font-bold text-slate-900">{totalAmount.toFixed(2)} ₴</span>
                  </div>
                </>
              )
            })()}
            <div className="mt-4">
              <Button
                className="w-full"
                disabled={!items.length}
                onClick={() => {
                  if (!user) {
                    navigate('/login', { replace: false, state: { from: '/checkout' } })
                    return
                  }
                  navigate('/checkout')
                }}
              >
                {user ? 'Перейти до оформлення' : 'Увійти для оформлення'}
              </Button>
              <div className="text-xs text-slate-500 mt-2">
                Введіть адресу та оберіть спосіб оплати.
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}


