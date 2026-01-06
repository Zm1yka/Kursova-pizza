# Вирішення помилки Firebase: auth/unauthorized-domain

## Проблема

Після деплою на Render при спробі увійти з'являється помилка:
```
Firebase: Error (auth/unauthorized-domain)
```

## Причина

Домен Render (наприклад, `vulcano-pizzeria.onrender.com`) не додано в список авторизованих доменів Firebase Authentication.

## Рішення

### Крок 1: Знайди URL свого сайту на Render

Після деплою Render надає URL типу:
- `https://vulcano-pizzeria.onrender.com`
- або твій кастомний домен

### Крок 2: Додай домен в Firebase Console

1. **Відкрий Firebase Console:**
   - Перейди на [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Вибери свій проект `webkursova-65b9c`

2. **Відкрий Authentication:**
   - В меню зліва знайди **Authentication**
   - Натисни на нього

3. **Відкрий Settings (Налаштування):**
   - Натисни на вкладку **Settings** (або **Налаштування**)
   - Прокрути вниз до розділу **Authorized domains** (Авторизовані домени)

4. **Додай домен Render:**
   - Натисни **Add domain** (Додати домен)
   - Введи домен Render (наприклад: `vulcano-pizzeria.onrender.com`)
   - **ВАЖЛИВО:** Не додавай `https://`, тільки домен: `vulcano-pizzeria.onrender.com`
   - Натисни **Add** (Додати)

5. **Перевір список доменів:**
   - Має бути:
     - `localhost` (для локальної розробки)
     - `vulcano-pizzeria.onrender.com` (твій Render домен)
     - Якщо є кастомний домен - додай його теж

### Крок 3: Перевірка

1. Онови сторінку на Render (Ctrl+F5 або Cmd+Shift+R)
2. Спробуй увійти знову
3. Помилка має зникнути

## Додатково: Якщо використовуєш кастомний домен

Якщо налаштував кастомний домен на Render (наприклад, `pizzeria.example.com`):

1. Додай його також в Firebase Console → Authentication → Settings → Authorized domains
2. Введи тільки домен без `https://`: `pizzeria.example.com`

## Примітка

Зміни в Firebase Console застосовуються миттєво, але іноді може знадобитися кілька хвилин. Якщо не працює відразу, зачекай 1-2 хвилини та спробуй знову.

## Перевірка списку доменів

Після додавання має бути щось таке:

```
Authorized domains:
✓ localhost
✓ vulcano-pizzeria.onrender.com
✓ (твій кастомний домен, якщо є)
```

---

**Після цього автентифікація має працювати! 🔥**

