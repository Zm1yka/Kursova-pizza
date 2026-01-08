import { apiGet, apiPost, apiPut } from './api'
import type { UserProfile } from '../types/userProfile'

export async function getUserProfile(_uid?: string): Promise<UserProfile | null> {
  // uid більше не потрібен, оскільки визначається на backend через токен
  try {
    return await apiGet('/users/profile')
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error
  }
}

export async function ensureUserProfile(input: { uid?: string; email: string | null; name?: string | null }) {
  // uid більше не потрібен, оскільки визначається на backend через токен
  return await apiPost('/users/profile', {
    email: input.email,
    name: input.name,
  })
}

export async function updateUserName(_uid: string, name: string) {
  // uid більше не потрібен, оскільки визначається на backend через токен
  return await apiPut('/users/profile/name', { name })
}

export async function updateUserProfile(_uid: string, input: { name?: string; phone?: string; address?: string }) {
  // uid більше не потрібен, оскільки визначається на backend через токен
  return await apiPut('/users/profile', input)
}


