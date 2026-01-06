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

/**
 * Провайдер автентифікації на основі Firebase Authentication.
 *
 * - Спостерігає за станом автентифікації через onAuthStateChanged
 * - Підтримує вхід та реєстрацію через email/password
 * - Підтримує вхід через Google акаунт через popup
 */
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

        await ensureUserProfile({ uid: u.uid, email: u.email, name: u.displayName })
        const profile = await getUserProfile(u.uid)
        const name = profile?.name || u.displayName || (u.email ? u.email.split('@')[0] : 'Користувач')

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
          await ensureUserProfile({
            uid: cred.user.uid,
            email: cred.user.email,
            name: cred.user.displayName,
          })
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
          await ensureUserProfile({ uid: cred.user.uid, email: cred.user.email, name })
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


