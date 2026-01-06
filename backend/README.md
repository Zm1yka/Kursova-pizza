# Backend - VULCANO Pizzeria

Backend частина проекту - Express сервер для обслуговування React додатку та роботи з Firebase.

## Що тут є?

- **`server.js`** - Express сервер для обслуговування статичних файлів та API endpoints
- **`scripts/seed-firestore.mjs`** - скрипт для заповнення Firestore початковими даними (піци, напої, інгредієнти)
- **`firestore.rules`** - правила безпеки для Firestore (хто може читати/писати дані)

## Як використовувати?

### Запуск сервера

1. **Побудуй frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Запусти backend сервер:**
   ```bash
   cd backend
   npm install
   npm start
   ```

Сервер запуститься на `http://localhost:3000` і обслуговуватиме React додаток.

### Seed скрипт

Скрипт додає початкові дані в Firestore:

1. **Підготуй ключ Firebase:**
   - Отримай Service Account ключ з Firebase Console
   - Збережи як `serviceAccountKey.json` в **корінь проекту** (не в backend/)

2. **Запусти скрипт:**
   ```bash
   npm install
   npm run seed
   ```

Скрипт:
- Додасть піци, напої та інгредієнти в Firestore
- Скопіює зображення в `frontend/public/tmp/`
- Якщо Firebase Storage налаштований, завантажить зображення туди

### Firestore Rules

Файл `firestore.rules` містить правила безпеки:

- **Піци, напої, інгредієнти** - всі можуть читати, ніхто не може писати
- **Профілі користувачів** - тільки власник може читати/писати
- **Кошики** - тільки власник може читати/писати
- **Замовлення** - тільки авторизовані можуть створювати, тільки власник може читати

**Як застосувати:**
1. Відкрий Firebase Console → Firestore Database → Rules
2. Скопіюй вміст `firestore.rules`
3. Натисни "Publish"

## Залежності

- `express` - веб-сервер для обслуговування статичних файлів та API
- `firebase-admin` - для роботи з Firebase Admin SDK (seed скрипт)
- `jpeg-js` - для обробки зображень

## Структура даних в Firestore

### Колекція `pizzas`
```javascript
{
  title: string,
  description: string,
  price: number,
  imageUrl: string,
  category: 'Meat' | 'Veggie' | 'Spicy',
  discountPercent?: number
}
```

### Колекція `drinks`
```javascript
{
  title: string,
  description: string,
  price: number,
  imageUrl: string,
  volume?: number // в мл
}
```

### Колекція `toppings`
```javascript
{
  title: string,
  price: number,
  imageUrl: string
}
```

### Колекція `users`
```javascript
{
  uid: string,
  email: string | null,
  name: string,
  phone?: string,
  address?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Колекція `carts/{userId}`
```javascript
{
  items: CartItem[],
  updatedAt: timestamp
}
```

### Колекція `orders`
```javascript
{
  userId: string,
  items: OrderItem[],
  totalAmount: number,
  status: 'new' | 'paid' | 'done' | 'cancelled',
  delivery: {
    name: string,
    phone: string,
    address: string,
    comment?: string
  },
  payment: {
    method: 'card' | 'cash',
    cardLast4?: string
  },
  timestamp: timestamp
}
```

## Примітки

- Seed скрипт запускається з папки `backend/`, але шукає `serviceAccountKey.json` в корені проекту
- Зображення копіюються в `frontend/public/tmp/` для локального використання
- Якщо Firebase Storage налаштований, зображення також завантажуються туди

