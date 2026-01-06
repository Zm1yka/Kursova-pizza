export function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Про нас</h1>
        <p className="text-sm text-slate-500">Дізнайтеся більше про нашу піцерію</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Наша історія</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              <strong className="text-orange-600">VULCANO</strong> — це місце, де традиції італійської кухні зустрічаються з сучасними технологіями. 
              Наша історія почалася з мрії створити піцерію, яка об'єднає автентичні італійські рецепти з сучасним підходом до обслуговування клієнтів.
            </p>
            <p>
              Ми готуємо піцу з любов'ю, використовуючи тільки найсвіжіші інгредієнти та секретні рецепти, 
              передані з покоління в покоління. Кожна піца в нашому меню — це результат багаторічного досвіду та 
              безперервного вдосконалення техніки приготування.
            </p>
            <p>
              Назва <strong className="text-orange-600">VULCANO</strong> символізує нашу пристрасть до справи — так само, як вулкан вивергає 
              гарячу лаву, ми створюємо гарячі, ароматні піци, які розпалюють апетит та приносять задоволення кожному клієнту.
            </p>
            <p>
              Завдяки нашому прагненню до досконалості та увазі до деталей, ми стали однією з найпопулярніших піцерій у місті, 
              де кожен може знайти піцу на свій смак.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Наші цінності</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-3 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="font-semibold text-slate-900 mb-2">Якість</div>
              <div className="text-sm text-slate-600 leading-relaxed">
                Ми використовуємо тільки найкращі інгредієнти: свіже тісто, якісний сир моцарела, свіжі овочі та м'ясо найвищого ґатунку. 
                Кожен інгредієнт проходить ретельний відбір перед тим, як потрапити до вашої піци.
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-3 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <div className="font-semibold text-slate-900 mb-2">Швидкість</div>
              <div className="text-sm text-slate-600 leading-relaxed">
                Наша команда працює швидко та ефективно. Ми гарантуємо швидку доставку протягом 30-45 хвилин та приготування 
                піци в найкоротші терміни без втрати якості.
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-3 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </div>
              <div className="font-semibold text-slate-900 mb-2">Любов</div>
              <div className="text-sm text-slate-600 leading-relaxed">
                Кожна піца готується з особливою увагою та любов'ю. Ми дбаємо про те, щоб кожен клієнт отримав не просто їжу, 
                а справжній кулінарний досвід, який залишить приємні спогади.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Наша команда</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Наша команда складається з досвідчених піцайоло, які майстерно володіють мистецтвом 
              приготування ідеальної піци. Кожен з наших кухарів пройшов спеціальне навчання та має 
              багаторічний досвід роботи з італійською кухнею.
            </p>
            <p>
              Кожна піца готується вручну з урахуванням усіх деталей та традицій італійської кухні. 
              Наші піцайоло знають секрети ідеального тіста, правильного розподілу інгредієнтів та 
              оптимального часу випікання для досягнення неперевершеного смаку.
            </p>
            <p>
              Ми постійно вдосконалюємо свої навички, вивчаємо нові технології та експериментуємо з 
              новими смаковими комбінаціями, щоб радувати наших клієнтів унікальними та смачними піцами.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Наші інгредієнти</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Ми ретельно відбираємо кожен інгредієнт для наших піц. Наше тісто готується щодня зі свіжого борошна 
              найвищого ґатунку, якісних дріжджів та чистої води. Сир моцарела імпортується безпосередньо з Італії, 
              щоб забезпечити автентичний смак.
            </p>
            <p>
              Овочі та м'ясо ми закуповуємо у перевірених постачальників, які гарантують свіжість та якість продукції. 
              Всі соуси готуються за нашими власними рецептами без використання шкідливих консервантів та добавок.
            </p>
            <p>
              Ми пропонуємо широкий вибір додаткових інгредієнтів, які ви можете додати до будь-якої піци за своїм смаком: 
              додатковий сир, гриби, оливки, пепероні, бекон, халапеньйо та багато іншого.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Наші послуги</h2>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              <strong className="text-orange-600">VULCANO</strong> пропонує не лише смачну піцу, але й зручні умови замовлення. 
              Ви можете замовити піцу онлайн через наш веб-сайт, обравши улюблену піцу з меню та додавши до неї потрібні інгредієнти.
            </p>
            <p>
              Ми надаємо швидку доставку по всьому місту протягом 30-45 хвилин. При замовленні від 300 ₴ доставка є безкоштовною. 
              Ви можете оплатити замовлення готівкою або карткою при отриманні.
            </p>
            <p>
              Наші робочі години: <strong>Пн–Пт: 10:00 — 22:00, Сб–Нд: 11:00 — 19:00</strong>. Ми завжди раді бачити вас та 
              приготувати для вас найсмачнішу піцу!
            </p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Наша місія</h2>
          <p className="text-slate-700 leading-relaxed">
            Наша місія — принести справжню італійську піцу до кожного дому, зберігаючи традиції та якість. 
            Ми прагнемо стати вашим улюбленим місцем для замовлення піци, де кожен клієнт відчуває особливу увагу 
            та отримує незабутній кулінарний досвід. <strong className="text-orange-600">VULCANO</strong> — це не просто піцерія, 
            це частина вашої сім'ї та друзів.
          </p>
        </div>
      </div>
    </div>
  )
}

