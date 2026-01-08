import admin from 'firebase-admin'

/**
 * Middleware для перевірки автентифікації користувача через Firebase токен
 */
export async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    const token = authHeader.substring(7) // Видаляємо "Bearer "
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token)
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      }
      next()
    } catch (error) {
      console.error('Помилка перевірки токену:', error)
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }
  } catch (error) {
    console.error('Помилка middleware автентифікації:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Опціональна автентифікація - додає user якщо токен є, але не блокує запит
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
        }
      } catch (error) {
        // Ігноруємо помилку, просто не додаємо користувача
      }
    }
    next()
  } catch (error) {
    // Продовжуємо без користувача
    next()
  }
}

