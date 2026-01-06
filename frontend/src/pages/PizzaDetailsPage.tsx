import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PizzaImage } from '../components/pizza/PizzaImage'
import { useCart } from '../hooks/useCart'
import { useToppings } from '../hooks/useToppings'
import type { Topping } from '../types/topping'
import { fetchPizzaById } from '../services/pizzas'
import { useEffect } from 'react'
import type { Pizza } from '../types/pizza'

export function PizzaDetailsPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { toppings, loading: toppingsLoading, error: toppingsError } = useToppings()

  const [pizza, setPizza] = useState<Pizza | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let alive = true
    async function run() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const p = await fetchPizzaById(id)
        if (!alive) return
        setPizza(p)
        setLoading(false)
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Помилка завантаження')
        setLoading(false)
      }
    }
    void run()
    return () => {
      alive = false
    }
  }, [id])

  const selectedToppings: Topping[] = useMemo(() => {
    const map = new Map(toppings.map((t) => [t.id, t]))
    return [...selectedIds].map((tid) => map.get(tid)).filter(Boolean) as Topping[]
  }, [selectedIds, toppings])

  const extrasTotal = useMemo(
    () => selectedToppings.reduce((sum, t) => sum + t.price, 0),
    [selectedToppings],
  )

  if (loading) {
    return <div className="text-sm text-slate-500">Завантаження піци…</div>
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!pizza) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
        Піцу не знайдено.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-500">
        <NavLink to="/menu" className="hover:text-slate-900">
          ← Назад до меню
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="h-64 sm:h-80 bg-slate-100">
            {pizza.imageUrl ? (
              <PizzaImage imageUrl={pizza.imageUrl} alt={pizza.title} className="h-full w-full object-cover block" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
                Немає зображення
              </div>
            )}
          </div>
          <div className="p-6 space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900">{pizza.title}</h1>
            <p className="text-slate-600">{pizza.description}</p>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm h-fit space-y-4">
          <div>
            <div className="text-sm text-slate-500">Базова ціна</div>
            <div className="text-xl font-semibold text-slate-900">{pizza.price.toFixed(2)} ₴</div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">Додаткові інгредієнти</div>
                <div className="text-sm text-slate-500">Натисни на інгредієнт, щоб додати/прибрати</div>
              </div>
              {selectedToppings.length ? (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Очистити
                </Button>
              ) : null}
            </div>

            {toppingsLoading ? <div className="text-sm text-slate-500 mt-3">Завантаження…</div> : null}
            {toppingsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 mt-3">
                {toppingsError}
              </div>
            ) : null}

            {!toppingsLoading && !toppingsError ? (
              <>
                {selectedToppings.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedToppings.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
                        onClick={() => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev)
                            next.delete(t.id)
                            return next
                          })
                        }}
                        title="Натисни, щоб прибрати"
                      >
                        <span>{t.title}</span>
                        <span className="text-emerald-700">×</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-500">Можна обрати декілька інгредієнтів.</div>
                )}

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {toppings.map((t) => {
                    const checked = selectedIds.has(t.id)
                    return (
                      <label
                        key={t.id}
                        className={[
                          'group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition',
                          checked
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedIds((prev) => {
                                const next = new Set(prev)
                                if (next.has(t.id)) next.delete(t.id)
                                else next.add(t.id)
                                return next
                              })
                            }}
                            className="sr-only"
                          />

                          <div
                            className={[
                              'h-11 w-11 rounded-2xl flex items-center justify-center overflow-hidden border',
                              checked ? 'bg-white border-emerald-200' : 'bg-slate-100 border-slate-200',
                            ].join(' ')}
                            aria-hidden
                          >
                            <img src={t.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">{t.title}</div>
                            <div className="text-xs text-slate-500">
                              {checked ? 'Вибрано' : 'Натисни, щоб додати'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-sm font-semibold text-slate-900">+{t.price.toFixed(2)} ₴</div>
                          <div
                            className={[
                              'h-6 w-6 rounded-full border flex items-center justify-center text-xs font-semibold',
                              checked ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'border-slate-200 text-slate-400',
                            ].join(' ')}
                            aria-hidden
                          >
                            {checked ? '✓' : '+'}
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </>
            ) : null}
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Додатки</span>
              <span className="font-semibold text-slate-900">{extrasTotal.toFixed(2)} ₴</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Разом</span>
              <span className="text-xl font-semibold text-slate-900">{(pizza.price + extrasTotal).toFixed(2)} ₴</span>
            </div>
            <Button className="w-full" onClick={() => addItem(pizza, selectedToppings)}>
              Додати в кошик
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}


