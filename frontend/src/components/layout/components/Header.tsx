import { NavLink } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'text-sm font-semibold transition rounded-xl px-3 py-2 border',
          isActive
            ? 'text-slate-900 bg-orange-50 border-orange-200'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function Header() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const burgerButtonRef = useRef<HTMLButtonElement>(null)

  // Закриття мобільного меню при кліку поза ним
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        burgerButtonRef.current &&
        !burgerButtonRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false)
      }
    }

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-md">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <NavLink 
              to="/" 
              className="font-semibold tracking-tight text-slate-900 flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all">
                <span className="text-xl font-bold">V</span>
              </span>
              <span className="leading-none">
                <span className="block text-[10px] tracking-[0.4em] text-slate-400 font-medium uppercase">PIZZERIA</span>
                <span className="block text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  VULCANO
                </span>
              </span>
            </NavLink>
            <nav className="hidden sm:flex items-center gap-3">
              <NavItem to="/menu" label="Меню" />
              <NavLink to="/cart" className="relative">
                <NavItem to="/cart" label="Кошик" />
                {totalItems ? (
                  <span className="absolute -top-1.5 -right-1.5 h-6 min-w-6 px-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-orange-500/40 animate-pulse">
                    {totalItems}
                  </span>
                ) : null}
              </NavLink>
              <NavItem to="/promotions" label="Акції" />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={burgerButtonRef}
              type="button"
              className="sm:hidden h-11 w-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              aria-label="Меню"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-700">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 group"
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-bold flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden sm:block text-sm font-semibold text-slate-800 max-w-[180px] truncate">
                    {user.name}
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors">▾</span>
                </button>

                {open ? (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl p-1.5 backdrop-blur-sm">
                    <NavLink
                      to="/profile"
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Профіль
                    </NavLink>
                    <NavLink
                      to="/profile/orders"
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Історія замовлень
                    </NavLink>
                    <NavLink
                      to="/about"
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Про нас
                    </NavLink>
                    <NavLink
                      to="/contacts"
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Контакти
                    </NavLink>
                    <div className="my-1.5 h-px bg-slate-200" />
                    <button
                      type="button"
                      className="w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={async () => {
                        setOpen(false)
                        await logout()
                      }}
                    >
                      Вийти
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="ghost" size="sm">
                    Увійти
                  </Button>
                </NavLink>
                <NavLink to="/register">
                  <Button size="sm">Реєстрація</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {mobileOpen ? (
          <div className="sm:hidden pb-4" ref={mobileMenuRef}>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-2 backdrop-blur-sm">
              <NavLink to="/menu" onClick={() => setMobileOpen(false)} className="block">
                <div className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-orange-50 hover:text-orange-700 transition-colors">Меню</div>
              </NavLink>
              <NavLink to="/cart" onClick={() => setMobileOpen(false)} className="block">
                <div className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-orange-50 hover:text-orange-700 transition-colors flex items-center justify-between">
                  <span>Кошик</span>
                  {totalItems ? (
                    <span className="h-6 min-w-6 px-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {totalItems}
                    </span>
                  ) : null}
                </div>
              </NavLink>
              <NavLink to="/promotions" onClick={() => setMobileOpen(false)} className="block">
                <div className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-orange-50 hover:text-orange-700 transition-colors">Акції</div>
              </NavLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}


