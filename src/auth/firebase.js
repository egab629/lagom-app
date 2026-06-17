import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const appId = import.meta.env.VITE_FIREBASE_APP_ID

export const isFirebaseConfigured = Boolean(apiKey && authDomain && projectId && appId)

let app = null
let auth = null
let googleProvider = null
let githubProvider = null
let db = null

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    appId,
  }

  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  githubProvider = new GithubAuthProvider()
  try {
    db = getFirestore(app)
  } catch (e) {
    console.warn('Firestore not available', e)
    db = null
  }
} else {
  // keep exports defined (null) so imports don't crash
  console.warn('Firebase not configured. Set VITE_FIREBASE_* env vars to enable auth.')
}

// Firestore helpers
async function saveUserSelection(uid, selection) {
  if (!db || !uid) return
  try {
    await setDoc(doc(db, 'users', uid), { selection }, { merge: true })
  } catch (e) {
    console.error('saveUserSelection error', e)
  }
}

async function getUserSelection(uid) {
  if (!db || !uid) return null
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) return snap.data().selection || null
    return null
  } catch (e) {
    console.error('getUserSelection error', e)
    return null
  }
}

export { auth, googleProvider, githubProvider, db, saveUserSelection, getUserSelection }
