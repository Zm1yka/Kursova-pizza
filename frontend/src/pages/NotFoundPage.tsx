import { NavLink } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center space-y-3 max-w-md shadow-sm">
        <div className="text-5xl font-semibold">404</div>
        <div className="text-slate-600">Сторінку не знайдено.</div>
        <NavLink to="/">
          <Button className="w-full">На головну</Button>
        </NavLink>
      </div>
    </div>
  )
}


