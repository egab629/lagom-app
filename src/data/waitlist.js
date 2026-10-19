import { collection, doc, getCountFromServer, getDoc, getDocs, query, serverTimestamp, where, writeBatch } from 'firebase/firestore'
import { db } from '../auth/firebase'

// Each waitlisted customer has two docs, both keyed by uid:
//   waitlist/{uid}       full entry (name, email, selections) - only the customer and admins can read it
//   waitlistHomes/{uid}  just { home } - any signed-in user can read it, so model counts never expose who is waiting

// The selection fields that make up a finished home, in step order
export const SELECTION_FIELDS = [
  { key: 'home', label: 'Home' },
  { key: 'counter', label: 'Counter' },
  { key: 'finish', label: 'Hardware Finish' },
  { key: 'cabinetColor', label: 'Cabinet Color' },
  { key: 'cabinetStyle', label: 'Cabinet Style' },
  { key: 'flooring', label: 'Flooring' },
  { key: 'sinkType', label: 'Sink Type' },
  { key: 'sinkStyle', label: 'Sink Style' },
  { key: 'sinkBowls', label: 'Sink Bowls' },
  { key: 'applianceFinish', label: 'Appliance Finish' },
]

export function pickSelections(selection) {
  return Object.fromEntries(SELECTION_FIELDS.map(({ key }) => [key, selection?.[key] || null]))
}

export function isSelectionComplete(selection) {
  return SELECTION_FIELDS.every(({ key }) => Boolean(selection?.[key]))
}

export function sameSelections(a, b) {
  return SELECTION_FIELDS.every(({ key }) => (a?.[key] || null) === (b?.[key] || null))
}

export async function getWaitlistEntry(uid) {
  if (!db || !uid) return null
  const snap = await getDoc(doc(db, 'waitlist', uid))
  return snap.exists() ? snap.data() : null
}

// Joins, switches model, or updates selections; keeps the original join date
export async function joinWaitlist(user, selection, existing) {
  const selections = pickSelections(selection)
  const batch = writeBatch(db)
  batch.set(doc(db, 'waitlist', user.uid), {
    uid: user.uid,
    name: user.displayName || null,
    email: user.email || null,
    home: selections.home,
    selections,
    joinedAt: existing?.joinedAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  batch.set(doc(db, 'waitlistHomes', user.uid), { home: selections.home })
  await batch.commit()
}

export async function leaveWaitlist(uid) {
  const batch = writeBatch(db)
  batch.delete(doc(db, 'waitlist', uid))
  batch.delete(doc(db, 'waitlistHomes', uid))
  await batch.commit()
}

// { 'Model 1': 3, ... } for the given model ids
export async function getWaitlistCounts(homeIds) {
  if (!db) return {}
  const entries = await Promise.all(
    homeIds.map(async (id) => {
      const snap = await getCountFromServer(query(collection(db, 'waitlistHomes'), where('home', '==', id)))
      return [id, snap.data().count]
    })
  )
  return Object.fromEntries(entries)
}

// Admin only (enforced by Firestore rules)
export async function getAllWaitlistEntries() {
  const snap = await getDocs(collection(db, 'waitlist'))
  return snap.docs.map((d) => d.data())
}

// Admin only: every customer's saved selections, whether or not they joined the waitlist
export async function getAllSavedSelections() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => d.data().selection).filter(Boolean)
}
