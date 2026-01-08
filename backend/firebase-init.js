import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync, readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Ініціалізація Firebase Admin
let firebaseInitialized = false

// Спробувати ініціалізувати з файлу (для локальної розробки)
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json')
if (existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    firebaseInitialized = true
    console.log('Firebase Admin ініціалізовано з файлу')
  } catch (error) {
    console.error('Помилка ініціалізації Firebase з файлу:', error)
  }
}

// Спробувати ініціалізувати з змінних середовища (для production)
if (!firebaseInitialized && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    console.log('Спроба ініціалізувати Firebase з FIREBASE_SERVICE_ACCOUNT...')
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT
    console.log('Довжина FIREBASE_SERVICE_ACCOUNT:', serviceAccountStr.length)
    const serviceAccount = JSON.parse(serviceAccountStr)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    firebaseInitialized = true
    console.log('Firebase Admin ініціалізовано зі змінної середовища')
  } catch (error) {
    console.error('Помилка ініціалізації Firebase зі змінної середовища:', error)
    console.error('Деталі помилки:', error.message)
    if (error instanceof SyntaxError) {
      console.error('Помилка парсингу JSON - перевірте, чи FIREBASE_SERVICE_ACCOUNT є валідним JSON')
    }
  }
}

// Якщо все ще не ініціалізовано, спробувати ініціалізувати з окремих env vars
if (!firebaseInitialized && process.env.FIREBASE_PROJECT_ID) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      }),
    })
    firebaseInitialized = true
    console.log('Firebase Admin ініціалізовано з окремих змінних середовища')
  } catch (error) {
    console.error('Помилка ініціалізації Firebase зі змінних середовища:', error)
  }
}

if (!firebaseInitialized) {
  console.error('ПОМИЛКА: Firebase Admin не ініціалізовано!')
  console.error('Будь ласка, надайте один з варіантів:')
  console.error('1. Файл serviceAccountKey.json (для локальної розробки)')
  console.error('2. Змінну середовища FIREBASE_SERVICE_ACCOUNT (JSON рядок)')
  console.error('3. Окремі змінні середовища FIREBASE_*')
  console.error('\nІнформація для діагностики:')
  console.error('- FIREBASE_SERVICE_ACCOUNT існує:', !!process.env.FIREBASE_SERVICE_ACCOUNT)
  console.error('- FIREBASE_PROJECT_ID існує:', !!process.env.FIREBASE_PROJECT_ID)
  console.error('- Всі змінні середовища:', Object.keys(process.env).filter(k => k.startsWith('FIREBASE')))
  process.exit(1)
}

export default admin

