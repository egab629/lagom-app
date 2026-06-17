import React from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useSelection } from '../state/SelectionProvider'
import { useNavigate } from 'react-router-dom'
import { saveUserSelection, isFirebaseConfigured } from '../auth/firebase'

export default function Dashboard() {
  const { user } = useAuth()
  const { selection, home, layout, elevation, counter, finish, cabinetColor, cabinetStyle, flooring, sinkType, sinkStyle, sinkBowls, applianceFinish, setSelection } = useSelection()
  const navigate = useNavigate()
  const stepPaths = [
    '/select-home',
    '/configure-home',
    '/select-counter',
    '/select-finish',
    '/select-cabinets',
    '/select-flooring',
    '/select-sink',
    '/select-appliances',
  ]

  const getResumePath = () => {
    if (!selection?.home) return '/select-home'
    if (selection?.lastStep && stepPaths.includes(selection.lastStep)) return selection.lastStep
    if (!selection?.layout || !selection?.elevation) return '/configure-home'
    if (!selection?.counter) return '/select-counter'
    if (!selection?.finish) return '/select-finish'
    if (!selection?.cabinetColor || !selection?.cabinetStyle) return '/select-cabinets'
    if (!selection?.flooring) return '/select-flooring'
    if (!selection?.sinkType || !selection?.sinkStyle || !selection?.sinkBowls) return '/select-sink'
    if (!selection?.applianceFinish) return '/select-appliances'
    return '/select-home'
  }

  const handleCustomizeHome = () => {
    navigate(getResumePath())
  }

  const clearSelection = async () => {
    setSelection({ home: null, layout: null, elevation: null, counter: null, finish: null, cabinetColor: null, cabinetStyle: null, flooring: null, sinkType: null, sinkStyle: null, sinkBowls: null, applianceFinish: null, lastStep: null })
    if (user && isFirebaseConfigured) {
      try {
        await saveUserSelection(user.uid, null)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
      {user ? (
        <div>
          <p className="text-gray-700">Welcome, {user.displayName || user.email}</p>
          <pre className="text-sm text-gray-500 mt-2">{JSON.stringify({ uid: user.uid, email: user.email }, null, 2)}</pre>
          <div className="mt-4">
            <h3 className="text-lg font-medium">Selected Lagom Home</h3>
            {home ? (
              <div className="mt-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-gray-700 font-semibold">{home}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Layout: {layout || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Elevation: {elevation || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Counter: {counter || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Finish: {finish || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Cabinets: {cabinetColor || 'Not set'} / {cabinetStyle || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Flooring: {flooring || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Sink: {sinkType || 'Not set'} / {sinkStyle || 'Not set'} / {sinkBowls || 'Not set'}</span>
                  <span className="rounded-full bg-lagom-50 px-2 py-1 text-sm text-lagom-700">Appliances: {applianceFinish || 'Not set'}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button onClick={handleCustomizeHome} className="text-sm text-white bg-lagom-500 hover:bg-lagom-600 font-medium px-4 py-2 rounded-md">Customize Your Home</button>
                  <button onClick={clearSelection} className="text-sm text-red-600 hover:text-red-700 font-medium">Clear</button>
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <p className="text-sm text-gray-500">No selection yet.</p>
                <button onClick={() => navigate('/select-home')} className="mt-2 inline-block text-sm text-lagom-600 hover:text-lagom-700 font-medium">Select your Lagom Home</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">You are not signed in.</p>
      )}
    </section>
  )
}
