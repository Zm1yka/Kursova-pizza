import { createContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebase'
import { ensureUserProfile, getUserProfile, updateUserName } from '../services/users'

export type AuthUser = {
  uid: string
  email: string | null
  name: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  setName: (name: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true)
      try {
        if (!u) {
          setUser(null)
          return
        }

        // Спробувати створити/оновити профіль, але не блокувати вхід якщо не вдалося
        try {
          await ensureUserProfile({ uid: u.uid, email: u.email, name: u.displayName })
        } catch (error) {
          console.warn('Failed to ensure user profile:', error)
          // Продовжуємо навіть якщо не вдалося створити профіль
        }

        // Спробувати отримати профіль, але не блокувати якщо не вдалося
        let name = u.displayName || (u.email ? u.email.split('@')[0] : 'Користувач')
        try {
          const profile = await getUserProfile(u.uid)
          if (profile?.name) {
            name = profile.name
          }
        } catch (error) {
          console.warn('Failed to get user profile:', error)
          // Використовуємо displayName або email як fallback
        }

        setUser({ uid: u.uid, email: u.email, name })
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      async login(email, password) {
        setError(null)
        try {
          await signInWithEmailAndPassword(auth, email, password)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Помилка входу')
          throw e
        }
      },
      async loginWithGoogle() {
        setError(null)
        try {
          const cred = await signInWithPopup(auth, googleProvider)
          // Спробувати створити профіль, але не блокувати вхід якщо не вдалося
          try {
            await ensureUserProfile({
              uid: cred.user.uid,
              email: cred.user.email,
              name: cred.user.displayName,
            })
          } catch (error) {
            console.warn('Не вдалося створити профіль після входу через Google:', error)
            // Продовжуємо навіть якщо не вдалося створити профіль
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Помилка входу через Google')
          throw e
        }
      },
      async register(name, email, password) {
        setError(null)
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password)
          await updateProfile(cred.user, { displayName: name })
          // Спробувати створити профіль, але не блокувати реєстрацію якщо не вдалося
          try {
            await ensureUserProfile({ uid: cred.user.uid, email: cred.user.email, name })
          } catch (error) {
            console.warn('Не вдалося створити профіль після реєстрації:', error)
            // Продовжуємо навіть якщо не вдалося створити профіль
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Помилка реєстрації')
          throw e
        }
      },
      async setName(name) {
        setError(null)
        const u = auth.currentUser
        if (!u) return
        await updateProfile(u, { displayName: name })
        await updateUserName(u.uid, name)
        setUser((prev) => (prev ? { ...prev, name } : prev))
      },
      async logout() {
        setError(null)
        await signOut(auth)
      },
    }),
    [user, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


