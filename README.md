# VULCANO Pizzeria 🍕

Онлайн-замовлення піци та напоїв. Курсова робота з веб-розробки.

## 📋 Опис проекту

Веб-застосунок для онлайн-замовлення піци з повним функціоналом електронної комерції. Додаток дозволяє користувачам переглядати каталог піц та напоїв, додавати товари до кошика, оформлювати замовлення з доставкою та переглядати історію покупок.

## 🏗️ Архітектура

Проект використовує **архітектуру клієнт-сервер**:

- **Frontend** - React додаток з TypeScript, що працює з Firebase напряму
- **Backend** - Express.js сервер для обслуговування статичних файлів та seed скрипт для заповнення бази даних

## 🛠️ Технології

### Frontend
- **React 19.2.3** - бібліотека для створення користувацьких інтерфейсів
- **TypeScript 5.9.3** - мова програмування з типізацією
- **Vite 7.2.4** - інструмент збірки та розробки
- **React Router DOM 7.11.0** - маршрутизація для односторінкового додатку
- **Tailwind CSS 4.1.18** - utility-first CSS фреймворк

### Backend
- **Express.js 4.22.1** - веб-фреймворк для Node.js
- **Firebase Admin SDK 13.6.0** - для seed скриптів та адміністративних операцій

### База даних та сервіси
- **Firebase Authentication** - автентифікація користувачів (email/password та Google OAuth)
- **Cloud Firestore** - NoSQL база даних для зберігання даних
- **Firebase Storage** - сервіс для зберігання файлів та зображень

```

## 🚀 Як запустити локально?

### Передумови

- Node.js 18+ та npm
- Firebase проект з налаштованими сервісами (Authentication, Firestore)

### Крок 1: Клонування репозиторію

```bash
git clone https://github.com/Zm1yka/Kursova-pizza.git
cd Kursova-pizza
```

### Крок 2: Налаштування Firebase

1. Створіть проект у [Firebase Console](https://console.firebase.google.com/)
2. Увімкніть **Authentication** (Email/Password та Google)
3. Створіть базу даних **Firestore**
4. Отримайте Service Account ключ:
   - Project settings → Service accounts
   - Натисніть "Generate new private key"
   - Збережіть як `serviceAccountKey.json` в **корінь проекту**

### Крок 3: Налаштування Firestore Rules

1. Відкрийте Firebase Console → Firestore Database → Rules
2. Скопіюйте вміст файлу `backend/firestore.rules`
3. Натисніть "Publish"

### Крок 4: Заповнення бази даних

```bash
cd backend
npm install
npm run seed
```

Скрипт додасть піци, напої та додатки в Firestore.

### Крок 5: Запуск Frontend

**Термінал 1:**
```bash
cd frontend
npm install
npm run dev
```

Frontend буде доступний на `http://localhost:5173`

### Крок 6: Запуск Backend (опціонально, для production)

**Термінал 2:**
```bash
cd backend
npm install
node server.js
```

Backend буде доступний на `http://localhost:3000`
