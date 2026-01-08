/**
 * Скрипт для підготовки Firebase credentials для Render.com
 * 
 * Використання:
 * node prepare-firebase-env.js
 * 
 * Скрипт прочитає serviceAccountKey.json та виведе JSON в один рядок,
 * який можна скопіювати в змінну середовища FIREBASE_SERVICE_ACCOUNT на Render
 */

import { readFileSync } from 'fs'

try {
  const serviceAccount = JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))
  const jsonString = JSON.stringify(serviceAccount)
  
  console.log('\n=== Скопіюйте цей текст в змінну FIREBASE_SERVICE_ACCOUNT на Render ===\n')
  console.log(jsonString)
  console.log('\n=== Інструкція ===')
  console.log('1. Перейдіть на Render.com → ваш сервіс → Environment')
  console.log('2. Натисніть "Add Environment Variable"')
  console.log('3. Key: FIREBASE_SERVICE_ACCOUNT')
  console.log('4. Value: вставте JSON вище')
  console.log('5. Збережіть та перезапустіть сервіс\n')
} catch (error) {
  console.error('Помилка:', error.message)
  console.error('\nПереконайтеся, що файл serviceAccountKey.json знаходиться в корені проекту')
  process.exit(1)
}

