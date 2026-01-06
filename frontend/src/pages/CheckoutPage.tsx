import { useMemo, useState } from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { createOrder } from '../services/orders'

function last4(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '')
  return digits.length >= 4 ? digits.slice(-4) : undefined
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '')
  const groups = []
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4))
  }
  return groups.join(' ').slice(0, 19)
}

function formatCardExp(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  const limited = digits.slice(0, 4)
  return `${limited.slice(0, 2)}/${limited.slice(2, 4)}`
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  const limited = digits.slice(0, 12)
  
  if (limited.length === 0) return ''
  if (limited.length <= 3) return `+${limited}`
  if (limited.length <= 6) return `+${limited.slice(0, 3)} ${limited.slice(3)}`
  if (limited.length <= 9) return `+${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
  return `+${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 9)} ${limited.slice(9)}`
}

function validateCardExp(exp: string): { valid: boolean; error?: string } {
  const digits = exp.replace(/\D/g, '')
  if (digits.length < 4) {
    return { valid: false, error: 'Введіть повний термін дії (MM/YY)' }
  }
  const month = parseInt(digits.slice(0, 2), 10)
  const year = parseInt(digits.slice(2, 4), 10)
  
  if (month < 1 || month > 12) {
    return { valid: false, error: 'Невірний місяць (01-12)' }
  }
  
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const fullYear = 2000 + year
  
  if (fullYear < now.getFullYear() || (fullYear === now.getFullYear() && month < currentMonth)) {
    return { valid: false, error: 'Картка прострочена' }
  }
  
  return { valid: true }
}

export function CheckoutPage() {
  const { user } = useAuth()
  const { items, totalAmount, clear } = useCart()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardExpError, setCardExpError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (!user) return false
    if (!items.length) return false
    const phoneDigits = phone.replace(/\D/g, '')
    if (!phone.trim() || phoneDigits.length < 10) return false
    if (!address.trim()) return false
    if (paymentMethod === 'card') {
      if (!cardName.trim()) return false
      if (cardNumber.replace(/\D/g, '').length < 12) return false
      if (!cardExp.trim() || !cardCvc.trim()) return false
      const expValidation = validateCardExp(cardExp)
      if (!expValidation.valid) return false
    }
    return true
  }, [user, items.length, phone, address, paymentMethod, cardName, cardNumber, cardExp, cardCvc])

  if (!user) return <Navigate to="/login" replace state={{ from: '/checkout' }} />

  if (!items.length) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">Оформлення</h1>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Кошик порожній. <NavLink to="/menu" className="text-orange-600 font-medium">Перейти до меню</NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Оформлення замовлення</h1>
        </div>
        <NavLink to="/cart" className="text-sm text-slate-600 hover:text-slate-900">
          ← Назад до кошика
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ім’я" value={user.name} disabled />
            <Input
              label="Телефон"
              placeholder="+380 XX XXX XX XX"
              value={phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value)
                setPhone(formatted)
              }}
              required
              inputMode="tel"
              maxLength={17}
            />
          </div>
          <Input
            label="Адреса доставки"
            placeholder="Місто, вулиця, будинок, квартира"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Input
            label="Коментар (необов’язково)"
            placeholder="Наприклад: домофон не працює, подзвоніть"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="font-semibold text-slate-900">Оплата</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                className={[
                  'rounded-2xl border px-4 py-3 text-left transition',
                  paymentMethod === 'card'
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50',
                ].join(' ')}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="font-medium text-slate-900">Карткою</div>
              </button>
              <button
                type="button"
                className={[
                  'rounded-2xl border px-4 py-3 text-left transition',
                  paymentMethod === 'cash'
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50',
                ].join(' ')}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="font-medium text-slate-900">Готівкою</div>
                <div className="text-xs text-slate-500">Оплата при отриманні</div>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ім’я на карті"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="NAME SURNAME"
                />
                <Input
                  label="Номер картки"
                  value={cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setCardNumber(formatted)
                  }}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
                <div>
                  <Input
                    label="Термін (MM/YY)"
                    value={cardExp}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '')
                      const formatted = formatCardExp(digitsOnly)
                      setCardExp(formatted)
                      if (formatted.replace(/\D/g, '').length === 4) {
                        const validation = validateCardExp(formatted)
                        setCardExpError(validation.error || null)
                      } else {
                        setCardExpError(null)
                      }
                    }}
                    placeholder="12/29"
                    inputMode="numeric"
                    maxLength={5}
                  />
                  {cardExpError ? (
                    <div className="mt-1 text-xs text-red-600">{cardExpError}</div>
                  ) : null}
                </div>
                <Input
                  label="CVC"
                  value={cardCvc}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 3)
                    setCardCvc(digits)
                  }}
                  placeholder="123"
                  inputMode="numeric"
                  maxLength={3}
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : null}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm h-fit space-y-4">
          <div className="font-semibold text-slate-900">Підсумок</div>
          <div className="space-y-2 text-sm text-slate-600">
            {items.slice(0, 4).map((it) => {
              if (!it.pizza && !it.drink) return null
              const title = it.pizza ? it.pizza.title : it.drink?.title || 'Невідомий товар'
              const price = it.pizza
                ? it.pizza.price + it.toppings.reduce((s, t) => s + t.price, 0)
                : it.drink?.price || 0
              
              return (
                <div key={it.key} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-slate-900 font-medium truncate">{title}</div>
                    <div className="text-xs text-slate-500">× {it.quantity}</div>
                  </div>
                  <div className="font-semibold text-slate-900 whitespace-nowrap">
                    {(it.quantity * price).toFixed(2)} ₴
                  </div>
                </div>
              )
            })}
            {items.length > 4 ? <div className="text-xs text-slate-500">…та ще</div> : null}
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <span className="text-slate-600">Разом</span>
            <span className="text-xl font-semibold text-slate-900">{totalAmount.toFixed(2)} ₴</span>
          </div>

          <Button
            className="w-full"
            disabled={!canSubmit || submitting}
            onClick={async () => {
              setError(null)
              setSubmitting(true)
              try {
                await createOrder({
                  userId: user.uid,
                  items,
                  totalAmount,
                  delivery: {
                    name: user.name,
                    phone: phone.replace(/\D/g, ''),
                    address: address.trim(),
                    ...(comment.trim() ? { comment: comment.trim() } : {}),
                  },
                  payment:
                    paymentMethod === 'card'
                      ? { method: 'card', cardLast4: last4(cardNumber) }
                      : { method: 'cash' },
                  status: 'new',
                })
                clear()
                navigate('/profile/orders', { replace: true })
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Помилка оформлення')
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {submitting ? 'Оформлення…' : 'Підтвердити замовлення'}
          </Button>
        </aside>
      </div>
    </div>
  )
}


