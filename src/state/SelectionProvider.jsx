import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { getUserSelection, saveUserSelection, isFirebaseConfigured } from '../auth/firebase'
import { getHome } from '../data/homes'

// selections saved before the Lagom 5 may name a home that no longer exists
function dropRetiredHome(s) {
  if (!s || !s.home || getHome(s.home)) return s
  return { ...s, home: null }
}

const SelectionContext = createContext(null)
export function useSelection() {
  return useContext(SelectionContext)
}

export function SelectionProvider({ children }) {
  const [selection, setSelection] = useState(() => {
    try {
      const stored = localStorage.getItem('selectedHome')
      return stored ? dropRetiredHome(JSON.parse(stored)) : { home: null, counter: null, finish: null, cabinetColor: null, cabinetStyle: null, flooring: null, sinkType: null, sinkStyle: null, sinkBowls: null, applianceFinish: null, lastStep: null }
    } catch (e) {
      return { home: null, counter: null, finish: null, cabinetColor: null, cabinetStyle: null, flooring: null, sinkType: null, sinkStyle: null, sinkBowls: null, applianceFinish: null, lastStep: null }
    }
  })

  useEffect(() => {
    try {
      if (selection && selection.home) {
        localStorage.setItem('selectedHome', JSON.stringify(selection))
      } else {
        localStorage.removeItem('selectedHome')
      }
    } catch (e) {
      // ignore
    }
  }, [selection])

  const { user } = useAuth()

  // when user signs in, try to load selection from Firestore
  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user || !isFirebaseConfigured) return
      const s = await getUserSelection(user.uid)
      if (mounted && s) setSelection(dropRetiredHome(s))
    }
    load()
    return () => { mounted = false }
  }, [user])

  // when selection changes and user is present, save to Firestore
  useEffect(() => {
    if (!user || !isFirebaseConfigured) return
    saveUserSelection(user.uid, selection)
  }, [selection, user])

  return (
    <SelectionContext.Provider
      value={{
        selection,
        home: selection?.home || null,
        counter: selection?.counter || null,
        finish: selection?.finish || null,
        cabinetColor: selection?.cabinetColor || null,
        cabinetStyle: selection?.cabinetStyle || null,
        flooring: selection?.flooring || null,
        sinkType: selection?.sinkType || null,
        sinkStyle: selection?.sinkStyle || null,
        sinkBowls: selection?.sinkBowls || null,
        applianceFinish: selection?.applianceFinish || null,
        lastStep: selection?.lastStep || null,
        setSelection,
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}

export default SelectionProvider
