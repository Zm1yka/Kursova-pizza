import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login, loginWithGoogle, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = useMemo(() => {
    const st = location.state as { from?: string } | null
    return st?.from ?? '/profile'
  }, [location.state])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Вхід</h1>
          <p className="text-sm text-slate-500">Увійдіть через Email/Password або Google акаунт.</p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full"
            variant="outline"
            type="button"
            disabled={loading || submitting}
            onClick={async () => {
              setSubmitting(true)
              try {
                await loginWithGoogle()
                navigate(redirectTo, { replace: true })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white border border-slate-200"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path
                    d="M23.49 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.44a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.15 3.58-8.78Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 24c3.24 0 5.96-1.08 7.95-2.95l-3.86-3c-1.08.73-2.46 1.17-4.09 1.17-3.12 0-5.76-2.1-6.7-4.93H1.3v3.1A11.99 11.99 0 0 0 12 24Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.3 14.29A7.2 7.2 0 0 1 4.92 12c0-.8.14-1.57.38-2.29V6.61H1.3A12 12 0 0 0 0 12c0 1.94.46 3.78 1.3 5.39l4-3.1Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.78c1.76 0 3.34.6 4.58 1.8l3.44-3.44C17.95 1.08 15.24 0 12 0 7.31 0 3.25 2.69 1.3 6.61l4 3.1C6.24 6.88 8.88 4.78 12 4.78Z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              Увійти через Google
            </span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs text-slate-400">або</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitting(true)
              try {
                await login(email, password)
                navigate(redirectTo, { replace: true })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Пароль"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error ? <div className="text-sm text-red-600">{error}</div> : null}

            <Button className="w-full" type="submit" disabled={loading || submitting}>
              Увійти
            </Button>
          </form>
        </div>

        <div className="text-sm text-slate-600">
          Немає акаунта?{' '}
          <NavLink to="/register" className="text-emerald-700 hover:text-emerald-600 font-medium">
            Зареєструватися
          </NavLink>
        </div>
        <NavLink to="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← На головну
        </NavLink>
      </div>
    </div>
  )
}


