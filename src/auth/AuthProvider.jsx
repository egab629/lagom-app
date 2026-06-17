import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, isFirebaseConfigured } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const AuthContext = createContext(null)
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setInitializing(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setInitializing(false)
    })

    return unsub
  }, [])

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) return
    try {
      await signOut(auth)
    } catch (e) {
      console.error('Sign out error', e)
    }
  }

  return (
    <AuthContext.Provider value={{ user, initializing, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
