import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Ініціалізація Firebase.
 * ПРИМІТКА: Для університетського проекту це нормально в коді, але для продакшену краще використовувати змінні середовища Vite (VITE_*).
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDY07AdC0QxQuYqvAK0DGIag09dtpyozC4',
  authDomain: 'webkursova-65b9c.firebaseapp.com',
  projectId: 'webkursova-65b9c',
  storageBucket: 'webkursova-65b9c.firebasestorage.app',
  messagingSenderId: '330101166176',
  appId: '1:330101166176:web:0617b8faa0e8542e83b305',
  measurementId: 'G-4XVRKKS5BG',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })


