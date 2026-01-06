import { usePizzas } from '../hooks/usePizzas'
import { PizzaCard } from '../components/pizza/PizzaCard'

export function PromotionsPage() {
  const { pizzas, loading, error } = usePizzas()

  const promotions = pizzas.filter((p) => p.discountPercent && p.discountPercent > 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Акції</h1>
          <p className="text-sm text-slate-500">Завантаження...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Акції</h1>
          <p className="text-sm text-red-600">Помилка: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Гарячі акції</h1>
          <p className="text-orange-50 text-lg">Економте на улюблених піцах!</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      </div>

      {promotions.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Піци зі знижкою</h2>
              <p className="text-sm text-slate-500">Оберіть улюблену піцу та економте</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200">
              <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-500">Активних акцій</div>
                <div className="font-bold text-orange-700">{promotions.length}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {promotions.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">2-га піца зі знижкою!</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Замовте 2 піци — кожна друга піца зі <strong className="text-orange-700">знижкою 15%</strong>!
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">Швидка доставка</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Отримайте замовлення вже через <strong>30-45 хвилин</strong> після оформлення.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
