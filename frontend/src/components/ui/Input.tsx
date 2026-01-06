import type { InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

/**
 * Reusable input component for all forms.
 */
export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label className="block space-y-1">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        id={inputId}
        className={[
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition shadow-sm',
          error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-orange-400',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      {error ? <div className="text-xs text-red-400">{error}</div> : null}
    </label>
  )
}


