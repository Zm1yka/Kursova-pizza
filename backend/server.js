import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'

// Ініціалізувати Firebase Admin ПЕРЕД імпортом маршрутів
import './firebase-init.js'
import apiRoutes from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

const distPath = path.join(__dirname, '../frontend/dist')
const indexHtmlPath = path.join(distPath, 'index.html')

// Middleware
app.use(express.json())

// CORS - дозволяємо запити з frontend
app.use((req, res, next) => {
  // В production дозволяємо тільки з того ж домену, в development - з будь-якого
  const origin = req.headers.origin
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`].filter(Boolean)
    : ['*']
  
  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*')
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// API маршрути
app.use('/api', apiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VULCANO Pizzeria API is running' })
})

// Статичні файли (тільки в production)
if (existsSync(distPath) && existsSync(indexHtmlPath)) {
  app.use(express.static(distPath))

  // SPA routing - всі інші запити на index.html
  app.get('*', (req, res) => {
    res.sendFile(indexHtmlPath, (err) => {
      if (err) {
        console.error('Помилка відправки index.html:', err)
        res.status(500).send('Внутрішня помилка сервера')
      }
    })
  })
} else if (process.env.NODE_ENV === 'production') {
  console.error(`ПОМИЛКА: Папка frontend/dist не знайдена за адресою: ${distPath}`)
  console.error('Переконайтеся, що frontend зібрано перед запуском сервера')
  process.exit(1)
}

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`)
  if (existsSync(distPath)) {
    console.log(`Обслуговуються статичні файли з: ${distPath}`)
  } else {
    console.log('Запущено в режимі тільки API (без статичних файлів)')
  }
})

