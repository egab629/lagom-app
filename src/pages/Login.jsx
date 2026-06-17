import React from 'react'
import { auth, googleProvider, isFirebaseConfigured } from '../auth/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) return alert('Firebase not configured. Add VITE_FIREBASE_* keys to .env')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/select-home')
    } catch (e) {
      console.error('Firebase sign-in error', e.code, e)
      alert('Sign-in failed (' + e.code + '): ' + e.message)
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900">Sign in</h2>
      <p className="text-sm text-gray-600 mb-6">Join Lagom to start your journey</p>
      {!isFirebaseConfigured && (
        <p className="text-sm text-amber-600 mb-4 bg-amber-50 p-3 rounded">Firebase not configured — create a `.env` with VITE_FIREBASE_* keys (see .env.example)</p>
      )}
      <div className="space-y-3">
        <button onClick={signInWithGoogle} className="w-full bg-lagom-500 hover:bg-lagom-600 text-white py-2 rounded font-medium transition">Sign in with Google</button>
      </div>
    </section>
  )
}
