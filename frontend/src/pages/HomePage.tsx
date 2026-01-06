import { NavLink } from 'react-router-dom'
import { PizzaCard } from '../components/pizza/PizzaCard'
import { NewsCarousel, type NewsSlide } from '../components/home/NewsCarousel'
import { usePizzas } from '../hooks/usePizzas'

export function HomePage() {
  const { pizzas, loading } = usePizzas()
  const recommended = pizzas.slice(0, 3)

  const news: NewsSlide[] = [
    {
      title: 'Комбо тижня: -15% на другу піцу',
      subtitle: 'Додавай у кошик дві піци — знижка застосовується автоматично.',
      imageUrl: 'https://foodish-api.com/images/pizza/pizza33.jpg',
    },
    {
      title: 'Гострий сезон',
      subtitle: 'Спробуй Діаволу або Ндую та додай халапеньйо.',
      imageUrl: 'https://foodish-api.com/images/pizza/pizza39.jpg',
    },
    {
      title: 'Овочева лінійка',
      subtitle: 'Більше зелені, більше смаку — легкі піци для щодня.',
      imageUrl: 'https://foodish-api.com/images/pizza/pizza47.jpg',
    },
    {
      title: 'Свіжі інгредієнти',
      subtitle: 'Додавай улюблені інгредієнти до будь-якої піци.',
      imageUrl: 'https://foodish-api.com/images/pizza/pizza26.jpg',
    },
  ]

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-orange-50/30 to-emerald-50 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Замовляйте піцу швидко, зручно та смачно
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed">
              Ласкаво просимо до <strong className="text-orange-600">VULCANO</strong> — піцерії, де традиції італійської кухні 
              зустрічаються з сучасними технологіями. Ми готуємо піцу з любов'ю, використовуючи тільки найсвіжіші інгредієнти 
              та секретні рецепти, передані з покоління в покоління.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Свіже тісто, якісні інгредієнти, багато сиру та унікальні комбінації смаків — обирай улюблену піцу з нашого 
              широкого меню та насолоджуйся неперевершеним смаком. Кожна піца готується вручну нашими досвідченими піцайоло 
              з урахуванням усіх традицій італійської кухні.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 p-8 text-center">
              <div className="text-6xl mb-4">🍕</div>
              <div className="text-2xl font-bold text-slate-900 mb-2">28+ видів піци</div>
              <div className="text-slate-600">На вибір для кожного смаку</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2 text-lg">Преміум якість</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Використовуємо тільки найкращі інгредієнти: свіже тісто, якісний сир, свіжі овочі та м'ясо найвищого ґатунку. 
            Кожна піца проходить контроль якості перед відправкою.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2 text-lg">Швидка доставка</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Отримайте ваше замовлення вже через 30-45 хвилин після оформлення. Ми працюємо швидко, щоб ви могли 
            насолоджуватися гарячою піцою якнайшвидше.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-2 text-lg">Готуємо з любов'ю</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Наша команда досвідчених піцайоло готує кожну піцу з особливою увагою до деталей. Ми дбаємо про те, 
            щоб кожен клієнт отримав ідеальну піцу.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Новини</h2>
        </div>
        <NewsCarousel slides={news} intervalMs={10_000} />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Рекомендовано</h2>
            <p className="text-sm text-slate-500 mt-1">Найпопулярніші піци від наших клієнтів</p>
          </div>
          <NavLink to="/menu" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Переглянути все →
          </NavLink>
        </div>
        {loading ? (
          <div className="text-sm text-slate-500">Завантаження…</div>
        ) : recommended.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Наразі немає доступних піц.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((p) => (
              <PizzaCard key={p.id} pizza={p} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Чому обирають нас?</h2>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-orange-600">VULCANO</strong> — це не просто піцерія, це місце, де збираються друзі та родина, 
              щоб насолодитися справжньою італійською піцою. Ми пропонуємо широкий вибір піц на будь-який смак: від класичних 
              рецептів до авторських комбінацій.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Наше меню включає понад 28 видів піци на будь-який смак. Ми працюємо з доставкою 
              по всьому місту та гарантуємо швидке приготування та доставку ваших улюблених страв.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">28+ видів піци</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">Швидка доставка</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">Свіжі інгредієнти</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white border border-slate-200 p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-1">28+</div>
              <div className="text-sm text-slate-600">Видів піци</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-1">30-45</div>
              <div className="text-sm text-slate-600">Хвилин доставка</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
              <div className="text-sm text-slate-600">Якість</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}


