import React, { useState, useEffect } from 'react'
import StepNav from '../components/StepNav'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'
import { homes, getHome, homeSpecs } from '../data/homes'
import FloorPlan from '../components/FloorPlan'
import { getWaitlistCounts } from '../data/waitlist'

export default function Step1() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [selected, setSelected] = useState(selection?.home || null)
  const [waitlistCounts, setWaitlistCounts] = useState({})

  useEffect(() => {
    let mounted = true
    getWaitlistCounts(homes.map((h) => h.id))
      .then((counts) => mounted && setWaitlistCounts(counts))
      .catch((e) => console.error('getWaitlistCounts error', e))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (selected) {
      setSelection({ ...selection, home: selected })
    }
  }, [selected])

  function confirmSelection() {
    if (!selected) return
    navigate('/select-counter')
  }

  function saveAndExit() {
    setSelection((prev) => ({ ...prev, home: selected || prev?.home || null }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 1 - Select Your Lagom Home</h2>
      <StepNav onNext={confirmSelection} canProceed={Boolean(selected)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-4">Choose the home that matches your living style and preferences. Only one selection allowed — confirm below before proceeding.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homes.map((home) => {
          const isSelected = selected === home.id
          return (
            <button
              key={home.id}
              onClick={() => setSelected(home.id)}
              aria-pressed={isSelected}
              className={
                `overflow-hidden rounded-lg border text-left transition duration-150 ` +
                (isSelected
                  ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200'
                  : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50')
              }
            >
              <img src={home.image} alt={home.id} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold">{home.id}</p>
                <p className="text-sm font-medium text-lagom-700 mt-1">{homeSpecs(home)}</p>
                {typeof waitlistCounts[home.id] === 'number' ? (
                  <p className="mt-2 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-lagom-700 ring-1 ring-lagom-200">
                    {waitlistCounts[home.id]} on the waitlist
                  </p>
                ) : null}
                <p className="text-sm text-gray-500 mt-2">{home.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {selected ? (
        <div className="mt-6">
          <FloorPlan home={getHome(selected)} />
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={confirmSelection}
          disabled={!selected}
          className={`px-4 py-2 rounded-md text-white font-medium ${selected ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Selection
        </button>

        <button
          onClick={() => setSelected(null)}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm"
        >
          Clear
        </button>

        <button
          onClick={() => navigate(-1)}
          className="ml-auto px-3 py-2 text-sm text-gray-600"
        >
          Back
        </button>
      </div>
    </section>
  )
}
