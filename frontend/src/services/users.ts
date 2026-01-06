import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { UserProfile } from '../types/userProfile'

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  const data = snap.data() as Record<string, unknown>
  return {
    uid,
    name: String(data.name ?? ''),
    email: (data.email as string | null | undefined) ?? null,
    phone: typeof data.phone === 'string' ? data.phone : undefined,
    address: typeof data.address === 'string' ? data.address : undefined,
  }
}

export async function ensureUserProfile(input: { uid: string; email: string | null; name?: string | null }) {
  const ref = doc(db, 'users', input.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const current = snap.data() as Record<string, unknown>
    const currentName = String(current.name ?? '')
    if (!currentName && input.name) {
      await updateDoc(ref, { name: input.name, updatedAt: serverTimestamp() })
    }
    return
  }

  await setDoc(ref, {
    uid: input.uid,
    email: input.email ?? null,
    name: input.name ?? '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateUserName(uid: string, name: string) {
  await updateDoc(doc(db, 'users', uid), { name, updatedAt: serverTimestamp() })
}

export async function updateUserProfile(uid: string, input: { name?: string; phone?: string; address?: string }) {
  await updateDoc(doc(db, 'users', uid), { ...input, updatedAt: serverTimestamp() })
}


