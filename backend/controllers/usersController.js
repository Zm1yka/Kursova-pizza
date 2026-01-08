import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const db = getFirestore()

/**
 * Отримати профіль користувача
 */
export async function getUserProfile(req, res) {
  try {
    const { uid } = req.user

    const userDoc = await db.collection('users').doc(uid).get()

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    const data = userDoc.data()

    res.json({
      uid,
      name: String(data.name ?? ''),
      email: data.email ?? null,
      phone: typeof data.phone === 'string' ? data.phone : undefined,
      address: typeof data.address === 'string' ? data.address : undefined,
    })
  } catch (error) {
    console.error('Помилка отримання профілю користувача:', error)
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}

/**
 * Створити або оновити профіль користувача
 */
export async function ensureUserProfile(req, res) {
  try {
    const { uid } = req.user
    const { email, name } = req.body

    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (userDoc.exists) {
      const current = userDoc.data()
      const currentName = String(current.name ?? '')
      if (!currentName && name) {
        await userRef.update({
          name,
          updatedAt: FieldValue.serverTimestamp(),
        })
      }
      return res.json({ success: true, message: 'Profile already exists' })
    }

    await userRef.set({
      uid,
      email: email ?? null,
      name: name ?? '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    res.json({ success: true, message: 'Profile created' })
  } catch (error) {
    console.error('Помилка створення/оновлення профілю користувача:', error)
    res.status(500).json({ error: 'Failed to ensure user profile' })
  }
}

/**
 * Оновити ім'я користувача
 */
export async function updateUserName(req, res) {
  try {
    const { uid } = req.user
    const { name } = req.body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Valid name is required' })
    }

    await db.collection('users').doc(uid).update({
      name: name.trim(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    res.json({ success: true, name: name.trim() })
  } catch (error) {
    console.error('Помилка оновлення імені користувача:', error)
    res.status(500).json({ error: 'Failed to update user name' })
  }
}

/**
 * Оновити профіль користувача
 */
export async function updateUserProfile(req, res) {
  try {
    const { uid } = req.user
    const { name, phone, address } = req.body

    const updateData = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name must be a non-empty string' })
      }
      updateData.name = name.trim()
    }

    if (phone !== undefined) {
      if (phone !== null && (typeof phone !== 'string' || phone.trim().length === 0)) {
        return res.status(400).json({ error: 'Phone must be a non-empty string or null' })
      }
      updateData.phone = phone ? phone.trim() : null
    }

    if (address !== undefined) {
      if (address !== null && (typeof address !== 'string' || address.trim().length === 0)) {
        return res.status(400).json({ error: 'Address must be a non-empty string or null' })
      }
      updateData.address = address ? address.trim() : null
    }

    await db.collection('users').doc(uid).update(updateData)

    res.json({ success: true, ...updateData })
  } catch (error) {
    console.error('Помилка оновлення профілю користувача:', error)
    res.status(500).json({ error: 'Failed to update user profile' })
  }
}

