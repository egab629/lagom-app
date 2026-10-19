import React, { useEffect, useState } from 'react'
import { isFirebaseConfigured } from '../auth/firebase'
import { getWaitlistEntry, isSelectionComplete, joinWaitlist, leaveWaitlist, sameSelections } from '../data/waitlist'

export default function WaitlistCard({ user, selection }) {
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    if (!user || !isFirebaseConfigured) {
      setLoading(false)
      return
    }
    getWaitlistEntry(user.uid)
      .then((e) => mounted && setEntry(e))
      .catch((e) => {
        console.error('getWaitlistEntry error', e)
        if (mounted) setError('Could not load your waitlist status.')
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [user])

  if (!isFirebaseConfigured || loading) return null

  const complete = isSelectionComplete(selection)
  const home = selection?.home

  async function run(action) {
    setBusy(true)
    setError(null)
    try {
      await action()
      setEntry(await getWaitlistEntry(user.uid))
    } catch (e) {
      console.error('waitlist error', e)
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const join = () => run(() => joinWaitlist(user, selection, entry))
  const leave = () => run(() => leaveWaitlist(user.uid))

  const joinedOn = entry?.joinedAt?.toDate?.().toLocaleDateString()
  const primary = 'rounded-md bg-lagom-500 px-4 py-2 text-sm font-medium text-white hover:bg-lagom-600 disabled:opacity-50'
  const secondary = 'text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50'

  let body
  if (entry && entry.home === home) {
    const changed = complete && !sameSelections(entry.selections, selection)
    body = (
      <>
        <p className="font-semibold text-gray-900">You're on the waitlist for {entry.home}.</p>
        {joinedOn ? <p className="text-sm text-gray-600">Joined {joinedOn}</p> : null}
        {changed ? <p className="text-sm text-amber-700">Your selections have changed since you joined.</p> : null}
        <div className="flex flex-wrap items-center gap-4">
          {changed ? <button onClick={join} disabled={busy} className={primary}>Update My Waitlist Selections</button> : null}
          <button onClick={leave} disabled={busy} className={secondary}>Leave Waitlist</button>
        </div>
      </>
    )
  } else if (entry) {
    body = (
      <>
        <p className="font-semibold text-gray-900">You're on the waitlist for {entry.home}.</p>
        <p className="text-sm text-gray-600">
          {complete ? `Switch to ${home} to keep your place in line with your new selections.` : `Finish customizing ${home || 'your home'} to switch your waitlist spot to it.`}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {complete ? <button onClick={join} disabled={busy} className={primary}>Switch Waitlist to {home}</button> : null}
          <button onClick={leave} disabled={busy} className={secondary}>Leave Waitlist</button>
        </div>
      </>
    )
  } else if (complete) {
    body = (
      <>
        <p className="font-semibold text-gray-900">Ready to reserve your spot?</p>
        <p className="text-sm text-gray-600">Join the waitlist for {home} with the selections above. We'll be in touch as homes become available.</p>
        <div>
          <button onClick={join} disabled={busy} className={primary}>Join the Waitlist for {home}</button>
        </div>
      </>
    )
  } else {
    body = (
      <>
        <p className="font-semibold text-gray-900">Join the waitlist</p>
        <p className="text-sm text-gray-600">Finish all 7 steps to join the waitlist for {home || 'your Lagom home'}.</p>
      </>
    )
  }

  return (
    <div className="space-y-2 rounded-xl border border-lagom-200 bg-lagom-50 p-4">
      {body}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
