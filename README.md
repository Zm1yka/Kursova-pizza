# VULCANO Pizzeria 🍕

Онлайн-замовлення піци та напоїв. Курсова робота з веб-розробки.

## Структура проекту

Проект розділений на дві частини:

- **`frontend/`** - React додаток (UI, компоненти, сторінки)
- **`backend/`** - Firebase конфігурація та seed скрипт

## Що це?

Веб-застосунок для замовлення піци з можливістю:
- Перегляду каталогу піц та напоїв
- Додавання товарів до кошика
- Оформлення замовлення з доставкою
- Реєстрації та авторизації
- Перегляду історії замовлень

## Технології

**Frontend:**
- React + TypeScript
- Tailwind CSS для стилів
- React Router для навігації
- Vite як збірник

**Backend:**
- Firebase Authentication (вхід через email або Google)
- Firestore (база даних)
- Firebase Storage (зображення)

## Як запустити?

### Frontend

1. **Перейди в папку frontend:**
```bash
cd frontend
```

2. **Встанови залежності:**
```bash
npm install
```

3. **Запусти проект:**
```bash
npm run dev
```

Відкрий браузер на `http://localhost:5173` (або інший порт, який покаже Vite).

### Backend

Backend частина використовується тільки для заповнення бази даних.

1. **Перейди в папку backend:**
```bash
cd backend
```

2. **Встанови залежності:**
```bash
npm install
```

3. **Запусти seed скрипт** (після налаштування Firebase):
```bash
npm run seed
```

## Як заповнити базу даних?

Для початку потрібно додати піци та напої в Firestore. Є скрипт, який це робить автоматично.

### Що потрібно:

1. **Отримай ключ від Firebase:**
   - Зайди в Firebase Console
   - Project settings → Service accounts
   - Натисни "Generate new private key"
   - Збережи файл як `serviceAccountKey.json` в **корінь проекту** (не в backend/)

2. **Запусти seed скрипт:**

```bash
cd backend
npm run seed
```

Скрипт додасть піци, напої та інгредієнти в Firestore. Зображення скопіює в папку `frontend/public/tmp/`.

## Налаштування Firebase

### Firestore Security Rules

Щоб піци та напої відображались, потрібно налаштувати правила доступу:

1. Відкрий Firebase Console → Firestore Database → Rules
2. Скопіюй вміст файлу `backend/firestore.rules`
3. Натисни "Publish"

Правила дозволяють:
- Всім читати піци, напої та інгредієнти
- Тільки авторизованим користувачам створювати замовлення
- Користувачам бачити тільки свої замовлення та кошик

### Firebase Storage

Зображення зберігаються локально в `frontend/public/tmp/`, тому Firebase Storage не обов'язковий. Але якщо хочеш використовувати Storage, налаштуй правила доступу в Firebase Console.

## Структура проекту

```
.
├── frontend/              # React додаток
│   ├── src/
│   │   ├── components/   # React компоненти
│   │   ├── pages/        # Сторінки додатку
│   │   ├── context/      # Context API (Auth, Cart)
│   │   ├── hooks/        # Кастомні хуки
│   │   ├── services/     # Робота з Firebase
│   │   ├── routes/       # Маршрутизація
│   │   └── types/        # TypeScript типи
│   ├── public/           # Статичні файли
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Backend частина
│   ├── scripts/          # Seed скрипт для Firestore
│   ├── firestore.rules   # Правила безпеки Firestore
│   └── package.json
│
├── serviceAccountKey.json  # Ключ Firebase (не комітиться)
└── README.md
```

## Основні функції

- **Каталог піц** — фільтрація за категоріями, сортування за ціною
- **Кошик** — зберігання в localStorage (гості) або Firestore (авторизовані)
- **Знижки** — автоматичний розрахунок знижок на піци та акція "2-га піца -15%"
- **Оформлення замовлення** — валідація картки, форматування телефону
- **Історія замовлень** — перегляд всіх своїх замовлень з деталями

## Команди

### Frontend
```bash
cd frontend
npm run dev      # Запуск dev сервера
npm run build    # Збірка для продакшену
npm run preview  # Перегляд зібраного проекту
```

### Backend
```bash
cd backend
npm run seed     # Заповнення Firestore даними
```

## Деплой

Проект деплоїться як **Web Service** на Render.com.

**Налаштування на Render:**
1. Створи **Web Service** (не Static Site)
2. Підключи репозиторій
3. Render автоматично використає `render.yaml` з налаштуваннями

**Що робить `render.yaml`:**
- Будує frontend (`cd frontend && npm install && npm run build`)
- Встановлює backend залежності (`cd ../backend && npm install`)
- Запускає Express сервер (`cd backend && npm start`)

Сервер обслуговує статичні файли React з `frontend/dist/` та надає API endpoints.

## Примітки

- Firebase credentials знаходяться в коді (для курсової це нормально)
- `serviceAccountKey.json` не комітиться в git (додано в `.gitignore`)
- Зображення піц та напоїв зберігаються локально в `frontend/public/tmp/`
- Seed скрипт запускається з папки `backend/`, але шукає `serviceAccountKey.json` в корені проекту

---

**Автор:** Курсова робота з веб-розробки  
**Рік:** 2024
