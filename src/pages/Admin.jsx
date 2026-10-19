import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { isAdmin } from '../auth/admin'
import { homes } from '../data/homes'
import { SELECTION_FIELDS, getAllSavedSelections, getAllWaitlistEntries } from '../data/waitlist'

function toDate(ts) {
  return ts?.toDate?.() || null
}

// [{ value, all, waitlist }] for one selection field, most popular first
function countField(key, saved, waitlist) {
  const rows = new Map()
  if (key === 'home') homes.forEach((h) => rows.set(h.id, { value: h.id, all: 0, waitlist: 0 }))
  const bump = (value, column) => {
    if (!value) return
    if (!rows.has(value)) rows.set(value, { value, all: 0, waitlist: 0 })
    rows.get(value)[column] += 1
  }
  saved.forEach((s) => bump(s[key], 'all'))
  waitlist.forEach((e) => bump(e.selections?.[key], 'waitlist'))
  return [...rows.values()].sort((a, b) => b.all - a.all || b.waitlist - a.waitlist || a.value.localeCompare(b.value))
}

function downloadCsv(entries) {
  const header = ['Position', 'Name', 'Email', 'Joined', ...SELECTION_FIELDS.map((f) => f.label)]
  const lines = entries.map((e, i) => [
    i + 1,
    e.name || '',
    e.email || '',
    toDate(e.joinedAt)?.toISOString() || '',
    ...SELECTION_FIELDS.map((f) => e.selections?.[f.key] || ''),
  ])
  const csv = [header, ...lines].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `lagom-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Admin() {
  const { user } = useAuth()
  const [waitlist, setWaitlist] = useState(null)
  const [saved, setSaved] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAdmin(user)) return
    Promise.all([getAllWaitlistEntries(), getAllSavedSelections()])
      .then(([w, s]) => {
        // oldest first = place in line
        w.sort((a, b) => (toDate(a.joinedAt)?.getTime() || 0) - (toDate(b.joinedAt)?.getTime() || 0))
        setWaitlist(w)
        setSaved(s)
      })
      .catch((e) => {
        console.error('admin load error', e)
        setError(e.code === 'permission-denied'
          ? 'Firestore blocked this request. Publish the rules in firestore.rules to the Firebase project, then reload.'
          : 'Could not load the waitlist.')
      })
  }, [user])

  if (!isAdmin(user)) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-2">Admin</h2>
        <p className="text-gray-600">This page is only available to Lagom staff.</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-2">Admin</h2>
        <p className="text-red-600">{error}</p>
      </section>
    )
  }

  if (!waitlist || !saved) {
    return <div className="text-center py-20 text-gray-600">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Waitlist</h2>
            <p className="text-sm text-gray-600">{waitlist.length} on the waitlist · {saved.length} customers with saved selections</p>
          </div>
          <button
            onClick={() => downloadCsv(waitlist)}
            disabled={!waitlist.length}
            className="rounded-md border border-lagom-300 px-3 py-2 text-sm font-medium text-lagom-700 hover:bg-lagom-50 disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {homes.map((h) => (
            <div key={h.id} className="rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-2xl font-semibold text-lagom-700">{waitlist.filter((e) => e.home === h.id).length}</p>
              <p className="text-sm text-gray-600">{h.id}</p>
            </div>
          ))}
        </div>

        {homes.map((h) => {
          const entries = waitlist.filter((e) => e.home === h.id)
          if (!entries.length) return null
          return (
            <div key={h.id} className="mt-6">
              <h3 className="mb-2 text-lg font-medium">{h.id}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 text-gray-500">
                    <tr>
                      <th className="py-2 pr-3 font-medium">#</th>
                      <th className="py-2 pr-3 font-medium">Name</th>
                      <th className="py-2 pr-3 font-medium">Email</th>
                      <th className="py-2 pr-3 font-medium">Joined</th>
                      <th className="py-2 font-medium">Selections</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e, i) => (
                      <tr key={e.uid} className="border-b border-gray-100 align-top">
                        <td className="py-2 pr-3 text-gray-500">{i + 1}</td>
                        <td className="py-2 pr-3">{e.name || '—'}</td>
                        <td className="py-2 pr-3"><a href={`mailto:${e.email}`} className="text-lagom-700 hover:underline">{e.email}</a></td>
                        <td className="py-2 pr-3 whitespace-nowrap">{toDate(e.joinedAt)?.toLocaleDateString() || '—'}</td>
                        <td className="py-2 text-gray-600">
                          {SELECTION_FIELDS.filter((f) => f.key !== 'home').map((f) => e.selections?.[f.key]).filter(Boolean).join(' · ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold">Selection Counts</h2>
        <p className="mb-4 text-sm text-gray-600">How often each option has been chosen. "All customers" counts everyone's saved selections, finished or not.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {SELECTION_FIELDS.map((f) => (
            <div key={f.key}>
              <h3 className="mb-1 font-medium">{f.label}</h3>
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500">
                  <tr>
                    <th className="py-1 pr-3 font-medium">Option</th>
                    <th className="py-1 pr-3 text-right font-medium">All customers</th>
                    <th className="py-1 text-right font-medium">On waitlist</th>
                  </tr>
                </thead>
                <tbody>
                  {countField(f.key, saved, waitlist).map((row) => (
                    <tr key={row.value} className="border-t border-gray-100">
                      <td className="py-1 pr-3">{row.value}</td>
                      <td className="py-1 pr-3 text-right tabular-nums">{row.all}</td>
                      <td className="py-1 text-right tabular-nums">{row.waitlist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
