import { useEffect, useState } from 'react'
import { NavLink, useParams, Navigate } from 'react-router-dom'
import { fetchOrderById, type OrderDoc } from '../services/ordersQuery'
import { useAuth } from '../hooks/useAuth'
import { PizzaImage } from '../components/pizza/PizzaImage'

function formatTimestamp(timestamp: unknown): string {
  if (!timestamp) return 'Дата не вказана'
  const ts = timestamp as { toMillis?: () => number } | null | undefined
  const millis = ts?.toMillis?.() ?? 0
  if (!millis) return 'Дата не вказана'
  const date = new Date(millis)
  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getStatusLabel(status?: string): string {
  switch (status) {
    case 'new':
      return 'Нове'
    case 'paid':
      return 'Оплачено'
    case 'done':
      return 'Виконано'
    case 'cancelled':
      return 'Скасовано'
    default:
      return 'Невідомо'
  }
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'paid':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'done':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    async function run() {
      if (!orderId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchOrderById(orderId)
        if (!alive) return
        if (!data) {
          setError('Замовлення не знайдено')
          return
        }
        // Перевірка, що замовлення належить поточному користувачу
        if (user && data.userId !== user.uid) {
          setError('Немає доступу до цього замовлення')
          return
        }
        setOrder(data)
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
  }, [orderId, user?.uid])

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `/profile/orders/${orderId}` }} />
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-slate-500">Завантаження деталей замовлення…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <NavLink to="/profile/orders" className="text-sm text-slate-600 hover:text-slate-900">
          ← Назад до історії замовлень
        </NavLink>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <NavLink to="/profile/orders" className="text-sm text-slate-600 hover:text-slate-900">
          ← Назад до історії замовлень
        </NavLink>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Замовлення не знайдено.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Деталі замовлення</h1>
          <p className="text-sm text-slate-500">Замовлення #{order.id.slice(0, 8)}</p>
        </div>
        <NavLink to="/profile/orders" className="text-sm text-slate-600 hover:text-slate-900">
          ← Назад до історії
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* Статус та дата */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500 mb-1">Статус</div>
                <div
                  className={`inline-block px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Дата замовлення</div>
                <div className="font-medium text-slate-900">{formatTimestamp(order.timestamp)}</div>
              </div>
            </div>
          </div>

          {/* Товари */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Що замовив клієнт</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-slate-100">
                    {item.imageUrl ? (
                      <PizzaImage
                        imageUrl={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        Немає фото
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    {item.type === 'drink' && item.volume ? (
                      <div className="text-sm text-slate-500">{item.volume} мл</div>
                    ) : null}
                    {item.toppings && item.toppings.length > 0 ? (
                      <div className="text-xs text-slate-500">
                        Додатки: {item.toppings.map((t) => t.title).join(', ')}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="text-sm text-slate-600">Кількість: {item.quantity}</div>
                      <div className="font-semibold text-slate-900">
                        {(item.price * item.quantity).toFixed(2)} ₴
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Доставка */}
          {order.delivery ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Доставка</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-500">Отримувач:</span>{' '}
                  <span className="font-medium text-slate-900">{order.delivery.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Телефон:</span>{' '}
                  <span className="font-medium text-slate-900">{order.delivery.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500">Адреса:</span>{' '}
                  <span className="font-medium text-slate-900">{order.delivery.address}</span>
                </div>
                {order.delivery.comment ? (
                  <div>
                    <span className="text-slate-500">Коментар:</span>{' '}
                    <span className="font-medium text-slate-900">{order.delivery.comment}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Оплата */}
          {order.payment ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Оплата</h2>
              <div className="text-sm">
                <div>
                  <span className="text-slate-500">Метод:</span>{' '}
                  <span className="font-medium text-slate-900">
                    {order.payment.method === 'card' ? 'Карткою' : 'Готівкою'}
                  </span>
                </div>
                {order.payment.method === 'card' && order.payment.cardLast4 ? (
                  <div className="mt-2">
                    <span className="text-slate-500">Картка:</span>{' '}
                    <span className="font-medium text-slate-900">**** {order.payment.cardLast4}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Підсумок */}
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm h-fit">
          <div className="font-semibold text-slate-900 mb-4">Підсумок</div>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="text-slate-900 font-medium truncate">{item.title}</div>
                  <div className="text-xs text-slate-500">× {item.quantity}</div>
                </div>
                <div className="font-semibold text-slate-900 whitespace-nowrap">
                  {(item.price * item.quantity).toFixed(2)} ₴
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-4 mt-4 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Разом</span>
            <span className="text-xl font-semibold text-slate-900">{Number(order.totalAmount).toFixed(2)} ₴</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

