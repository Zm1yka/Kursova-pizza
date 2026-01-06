import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchOrdersByUser, type OrderDoc } from '../services/ordersQuery'
import { useAuth } from '../hooks/useAuth'

export function OrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    async function run() {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchOrdersByUser(user.uid)
        if (!alive) return
        setOrders(data)
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Помилка завантаження')
      } finally {
        if (alive) setLoading(false)
      }
    }
    void run()
    return () => {
      alive = false
    }
  }, [user?.uid])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Історія замовлень</h1>
      </div>

      {loading ? <div className="text-sm text-slate-500">Завантаження…</div> : null}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error ? (
        orders.length ? (
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                onClick={() => navigate(`/profile/orders/${o.id}`)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="font-semibold text-slate-900">Замовлення #{o.id.slice(0, 8)}</div>
                  <div className="text-sm text-slate-600">
                    Сума: <span className="font-semibold text-slate-900">{Number(o.totalAmount).toFixed(2)} ₴</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {o.items?.slice(0, 3).map((it, idx) => (
                    <div key={idx}>
                      {it.title} × {it.quantity}
                      {it.type === 'drink' && it.volume ? ` (${it.volume} мл)` : ''}
                      {it.toppings?.length ? ` (додатки: ${it.toppings.map((t) => t.title).join(', ')})` : ''}
                    </div>
                  ))}
                  {o.items?.length > 3 ? <div className="text-xs text-slate-500">…та ще {o.items.length - 3}</div> : null}
                </div>
                <div className="mt-3 text-xs text-orange-600 font-medium">Переглянути деталі →</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Поки що немає замовлень.
          </div>
        )
      ) : null}
    </div>
  )
}


