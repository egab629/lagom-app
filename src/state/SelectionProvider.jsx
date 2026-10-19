import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { getUserSelection, saveUserSelection, isFirebaseConfigured } from '../auth/firebase'
import { getHome } from '../data/homes'

// selections saved before the Lagom 5 may name a home that no longer exists
function dropRetiredHome(s) {
  if (!s || !s.home || getHome(s.home)) return s
  return { ...s, home: null }
}

const EMPTY_SELECTION = { home: null, counter: null, finish: null, cabinetColor: null, cabinetStyle: null, flooring: null, sinkType: null, sinkStyle: null, sinkBowls: null, applianceFinish: null, lastStep: null }

const SelectionContext = createContext(null)
export function useSelection() {
  return useContext(SelectionContext)
}

export function SelectionProvider({ children }) {
  const [selection, setSelection] = useState(() => {
    try {
      const stored = localStorage.getItem('selectedHome')
      return stored ? dropRetiredHome(JSON.parse(stored)) : EMPTY_SELECTION
    } catch (e) {
      return EMPTY_SELECTION
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
  const uid = user?.uid || null
  // uid whose Firestore selection has been loaded; saving waits for this so the
  // browser's copy can't overwrite the account's saved selection on sign-in
  const [loadedUid, setLoadedUid] = useState(null)
  const prevUid = useRef(null)

  // signing out clears this browser so the next person to sign in doesn't inherit the selection
  useEffect(() => {
    if (prevUid.current && !uid) setSelection(EMPTY_SELECTION)
    prevUid.current = uid
  }, [uid])

  // on sign-in, the account's saved selection wins; if it has none, keep this browser's
  useEffect(() => {
    let mounted = true
    setLoadedUid(null)
    if (!uid || !isFirebaseConfigured) return
    getUserSelection(uid)
      .then((s) => {
        if (!mounted) return
        const saved = dropRetiredHome(s)
        if (saved?.home) setSelection(saved)
        setLoadedUid(uid)
      })
      .catch((e) => console.error('getUserSelection error', e))
    return () => { mounted = false }
  }, [uid])

  useEffect(() => {
    if (!uid || !isFirebaseConfigured || loadedUid !== uid) return
    saveUserSelection(uid, selection)
  }, [selection, uid, loadedUid])

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
