import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

const distPath = path.join(__dirname, '../frontend/dist')
const indexHtmlPath = path.join(distPath, 'index.html')

if (!existsSync(distPath)) {
  console.error(`ERROR: Frontend dist folder not found at: ${distPath}`)
  console.error('Make sure frontend is built before starting the server')
  process.exit(1)
}

if (!existsSync(indexHtmlPath)) {
  console.error(`ERROR: index.html not found at: ${indexHtmlPath}`)
  process.exit(1)
}

app.use(express.json())

app.use(express.static(distPath))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VULCANO Pizzeria API is running' })
})

app.get('*', (req, res) => {
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err)
      res.status(500).send('Internal Server Error')
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Serving static files from: ${distPath}`)
})

