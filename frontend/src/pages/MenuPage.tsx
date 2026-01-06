import { useMemo, useState } from 'react'
import { PizzaCard } from '../components/pizza/PizzaCard'
import { DrinkCard } from '../components/drink/DrinkCard'
import type { PizzaCategory } from '../types/pizza'
import { usePizzas } from '../hooks/usePizzas'
import { useDrinks } from '../hooks/useDrinks'

type Sort = 'price-asc' | 'price-desc'

const categoryLabel: Record<PizzaCategory, string> = {
  Meat: "М'ясні",
  Veggie: 'Овочеві',
  Spicy: 'Гострі',
}

/**
 * Сторінка меню з клієнтською фільтрацією (категорія) та сортуванням (ціна).
 * Складність: фільтрація/сортування мають O(n) та O(n log n) на клієнтському списку відповідно.
 */
export function MenuPage() {
  const { pizzas: allPizzas, loading, error } = usePizzas()
  const { drinks, loading: drinksLoading, error: drinksError } = useDrinks()
  const [category, setCategory] = useState<PizzaCategory | 'All'>('All')
  const [sort, setSort] = useState<Sort>('price-asc')

  const pizzas = useMemo(() => {
    const filtered = category === 'All' ? allPizzas : allPizzas.filter((p) => p.category === category)
    const sorted = [...filtered].sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price))
    return sorted
  }, [allPizzas, category, sort])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Меню</h1>
          <p className="text-sm text-slate-500">Оберіть улюблену піцу</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
          <label className="text-sm">
            <div className="text-slate-700 mb-1 font-medium">Категорія</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none shadow-sm focus:border-orange-500"
              value={category}
              onChange={(e) => setCategory(e.target.value as PizzaCategory | 'All')}
            >
              <option value="All">Усі</option>
              <option value="Meat">{categoryLabel.Meat}</option>
              <option value="Veggie">{categoryLabel.Veggie}</option>
              <option value="Spicy">{categoryLabel.Spicy}</option>
            </select>
          </label>

          <label className="text-sm">
            <div className="text-slate-700 mb-1 font-medium">Сортування</div>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none shadow-sm focus:border-orange-500"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="price-asc">Ціна: від меншої → більшої</option>
              <option value="price-desc">Ціна: від більшої → меншої</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? <div className="text-sm text-slate-500">Завантаження піц…</div> : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error ? (
        pizzas.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pizzas.map((p) => (
              <PizzaCard key={p.id} pizza={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Наразі немає доступних піц.
          </div>
        )
      ) : null}

      <section className="space-y-4 pt-8 border-t border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Напої</h2>
          <p className="text-sm text-slate-500 mt-1">Освіжаючі напої до вашої піци</p>
        </div>

        {drinksLoading ? (
          <div className="text-sm text-slate-500">Завантаження напоїв…</div>
        ) : drinksError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{drinksError}</div>
        ) : drinks.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {drinks.map((d) => (
              <DrinkCard key={d.id} drink={d} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Наразі немає доступних напоїв.
          </div>
        )}
      </section>
    </div>
  )
}


