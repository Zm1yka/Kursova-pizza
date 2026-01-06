import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { getUserProfile, updateUserProfile } from '../services/users'
import { fetchOrdersByUser } from '../services/ordersQuery'

export function ProfilePage() {
  const { user, setName } = useAuth()
  const [name, setLocalName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  const [ordersCount, setOrdersCount] = useState<number>(0)

  useEffect(() => {
    let alive = true
    async function run() {
      if (!user) return
      setProfileLoading(true)
      try {
        const p = await getUserProfile(user.uid)
        if (!alive) return
        setLocalName(p?.name || user.name)
        setPhone(p?.phone ?? '')
        setAddress(p?.address ?? '')
      } finally {
        if (alive) setProfileLoading(false)
      }
    }
    void run()
    return () => {
      alive = false
    }
  }, [user?.uid])

  useEffect(() => {
    let alive = true
    async function run() {
      if (!user) return
      try {
        const orders = await fetchOrdersByUser(user.uid)
        if (!alive) return
        setOrdersCount(orders.length)
      } catch {
        if (!alive) return
        setOrdersCount(0)
      }
    }
    void run()
    return () => {
      alive = false
    }
  }, [user?.uid])

  const initials = useMemo(() => (user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'), [user?.name])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Профіль</h1>
        <p className="text-sm text-slate-500">Контактні дані для швидкого оформлення</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-orange-100 text-orange-700 font-semibold flex items-center justify-center text-xl">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-slate-500">Вітаємо,</div>
              <div className="text-xl font-semibold text-slate-900 truncate">{user?.name ?? 'Користувач'}</div>
              <div className="text-sm text-slate-500 truncate">{user?.email ?? '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Як до вас звертатися?"
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Ваше ім’я"
              disabled={profileLoading}
            />
            <Input
              label="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380..."
              disabled={profileLoading}
            />
          </div>
          <Input
            label="Адреса доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Місто, вулиця, будинок, квартира"
            disabled={profileLoading}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              disabled={!user || saving || !name.trim()}
              onClick={async () => {
                if (!user) return
                setSaving(true)
                try {
                  const n = name.trim()
                  await setName(n)
                  await updateUserProfile(user.uid, {
                    name: n,
                    phone: phone.trim(),
                    address: address.trim(),
                  })
                } finally {
                  setSaving(false)
                }
              }}
            >
              {saving ? 'Збереження…' : 'Зберегти профіль'}
            </Button>
            <NavLink to="/checkout">
              <Button variant="outline" className="w-full sm:w-auto">
                Перейти до оформлення →
              </Button>
            </NavLink>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm h-fit space-y-4">
          <div className="font-semibold text-slate-900">Швидкі дії</div>
          <div className="grid grid-cols-1 gap-2">
            <NavLink to="/menu" className="rounded-2xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
              <div className="font-medium text-slate-900">Меню</div>
              <div className="text-xs text-slate-500">Додай піцу в кошик</div>
            </NavLink>
            <NavLink to="/cart" className="rounded-2xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
              <div className="font-medium text-slate-900">Кошик</div>
              <div className="text-xs text-slate-500">Перевір позиції та суму</div>
            </NavLink>
            <NavLink to="/profile/orders" className="rounded-2xl border border-slate-200 px-4 py-3 hover:bg-slate-50">
              <div className="font-medium text-slate-900">Замовлення</div>
              <div className="text-xs text-slate-500">Всього: {ordersCount}</div>
            </NavLink>
          </div>
        </aside>
      </div>
    </div>
  )
}


