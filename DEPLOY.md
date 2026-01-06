# Деплой на Render.com

Інструкція з деплою проекту VULCANO Pizzeria на Render.com.

## Важливо

На Render деплоїться **тільки frontend частина**. Backend (seed скрипт та Firestore rules) використовується тільки локально для налаштування бази даних.

## Підготовка

### 1. Переконайся, що все закомічено

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Перевір, що frontend працює локально

```bash
cd frontend
npm install
npm run build
```

Якщо білд успішний, можна деплоїти.

## Деплой на Render

### Крок 1: Створення акаунту

1. Перейди на [https://render.com/](https://render.com/)
2. Натисни **"Get Started for Free"** або **"Sign In"**
3. Увійди через GitHub/GitLab/Bitbucket (рекомендовано)

### Крок 2: Створення Static Site

1. В Dashboard натисни **"New +"** → **"Static Site"**

2. **Підключення репозиторію:**
   - Якщо використовуєш GitHub/GitLab/Bitbucket:
     - Натисни **"Connect account"**
     - Дозволь Render доступ до твого репозиторію
     - Вибери репозиторій з проектом
   - Якщо використовуєш інший Git:
     - Введи URL репозиторію
     - Додай SSH ключ або токен доступу

3. **Налаштування деплою:**
   - **Name:** `vulcano-pizzeria` (або будь-яка назва)
   - **Branch:** `main` (або `master`)
   - **Root Directory:** `frontend` ⚠️ **ВАЖЛИВО!** Вкажи папку frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables (опціонально):**
   - `NODE_ENV` = `production`

5. **Натисни "Create Static Site"**

### Крок 3: Очікування деплою

1. Render почне автоматичний деплой
2. Ти побачиш логи білду в реальному часі
3. Після успішного білду сайт буде доступний за URL типу:
   ```
   https://vulcano-pizzeria.onrender.com
   ```

## Альтернатива: Використання render.yaml

Якщо хочеш використати файл `render.yaml` з репозиторію:

1. Створи Static Site вручну (як описано вище)
2. Render автоматично використає налаштування з `render.yaml`
3. Або вручну вкажи налаштування з файлу

**Поточний `render.yaml`:**
```yaml
services:
  - type: web
    name: vulcano-pizzeria
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

## Перевірка після деплою

### 1. Перевір основні сторінки:
- ✅ Головна: `/`
- ✅ Меню: `/menu`
- ✅ Кошик: `/cart`
- ✅ Профіль: `/profile` (потрібна авторизація)
- ✅ Логін: `/login`

### 2. Перевір Firebase:
- ✅ Автентифікація працює
- ✅ Firestore читає дані (піци, напої)
- ✅ Створення замовлень працює

### 3. Перевір зображення:
- ✅ Зображення піц завантажуються
- ✅ Зображення напоїв завантажуються
- ✅ Локальні зображення з `/tmp/foto/` працюють

## Вирішення проблем

### Проблема: "Build failed"

**Рішення:**
1. Перевір логи білду в Render Dashboard
2. Переконайся, що вказав правильний **Root Directory: `frontend`**
3. Перевір, що команда `npm run build` працює локально:
   ```bash
   cd frontend
   npm run build
   ```

### Проблема: "404 на маршрутах React Router"

**Рішення:**
1. Перевір, що файл `frontend/public/_redirects` існує
2. Перевір вміст: має бути `/*    /index.html   200`
3. Переконайся, що файл знаходиться в `frontend/public/` директорії

### Проблема: "Firebase не працює"

**Рішення:**
1. Перевір, що Firebase credentials правильні в `frontend/src/firebase/firebase.ts`
2. Перевір Firestore Security Rules в Firebase Console
3. Перевір Firebase Storage Rules

### Проблема: "Зображення не завантажуються"

**Рішення:**
1. Перевір, що зображення в `frontend/public/tmp/foto/` та `frontend/public/tmp/napoi/`
2. Перевір шляхи до зображень в Firestore
3. Перевір Firebase Storage Rules для публічного доступу

## Оновлення проекту

Після змін в коді:

1. **Закоміть зміни:**
   ```bash
   git add .
   git commit -m "Update project"
   git push origin main
   ```

2. **Render автоматично почне новий деплой**

3. **Перевір статус в Render Dashboard**

## Налаштування кастомного домену

1. В налаштуваннях Static Site знайди **"Custom Domains"**
2. Додай свій домен
3. Налаштуй DNS записи згідно інструкцій Render

## Checklist перед деплоєм

- [ ] Всі зміни закомічені та запушені
- [ ] `serviceAccountKey.json` в `.gitignore`
- [ ] `frontend/public/_redirects` існує та правильний
- [ ] `render.yaml` налаштований (опціонально)
- [ ] Firebase credentials правильні
- [ ] Локальний білд працює (`cd frontend && npm run build`)
- [ ] Firestore Security Rules налаштовані
- [ ] Firebase Storage Rules налаштовані
- [ ] Вказав **Root Directory: `frontend`** в Render

---

**Успішного деплою! 🚀**

