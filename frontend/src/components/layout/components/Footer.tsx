export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="text-lg font-semibold">Робочі години</div>
            <div className="h-px bg-orange-500/60" />
            <div className="text-sm text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span>Пн–Пт</span>
                <span className="text-slate-200">11:00 — 22:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Сб–Нд</span>
                <span className="text-slate-200">11:00 — 19:00</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="text-center">
              <div className="tracking-[0.35em] text-sm text-slate-300">PIZZERIA</div>
              <div className="mt-1 text-2xl font-semibold">VULCANO</div>
              <div className="mx-auto mt-2 h-px w-40 bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
            </div>
          </div>

          <div className="space-y-4 md:text-right">
            <div className="text-lg font-semibold">Соцмережі</div>
            <div className="h-px bg-orange-500/60" />
            <div className="flex items-center gap-3 md:justify-end">
              <a
                href="#"
                className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-900/70 transition flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-200">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v1.9H17l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-900/70 transition flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-200">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-2.1a1.05 1.05 0 1 1-1.05-1.05 1.05 1.05 0 0 1 1.05 1.05z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


