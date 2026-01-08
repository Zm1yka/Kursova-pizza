/**
 * Базовий API клієнт для роботи з backend
 */

// В production використовуємо відносний шлях (той самий домен), в development - localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')

/**
 * Отримати токен авторизації з Firebase
 */
async function getAuthToken(): Promise<string | null> {
  const { auth } = await import('../firebase/firebase')
  const user = auth.currentUser
  if (!user) return null
  return await user.getIdToken()
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

/**
 * Виконати HTTP запит з автентифікацією
 */
async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<any> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Невідома помилка' }))
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * GET запит
 */
export async function apiGet<T = any>(url: string): Promise<T> {
  return fetchWithAuth(url, { method: 'GET' })
}

/**
 * POST запит
 */
export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PUT запит
 */
export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE запит
 */
export async function apiDelete<T = any>(url: string): Promise<T> {
  return fetchWithAuth(url, { method: 'DELETE' })
}

