import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'
import StepNav from '../components/StepNav'

const options = [
  { id: 'Vinyl - Aspen Oak', swatch: 'bg-amber-100' },
  { id: 'Vinyl - Driftwood', swatch: 'bg-amber-200' },
  { id: 'Vinyl - Weathered Gray', swatch: 'bg-gray-300' },
  { id: 'Vinyl - Coastal White', swatch: 'bg-white border border-gray-200' },
]

export default function Step6() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [flooring, setFlooring] = useState(selection?.flooring || null)

  useEffect(() => {
    if (!selection?.home) {
      navigate('/select-home')
    }
  }, [selection, navigate])

  useEffect(() => {
    setFlooring(selection?.flooring || null)
  }, [selection?.flooring])

  function confirmFlooring() {
    if (!flooring) return
    setSelection({
      ...selection,
      flooring,
    })
    navigate('/select-sink')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      flooring: flooring || prev?.flooring || null,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 6 - Select Flooring</h2>
      <StepNav onNext={confirmFlooring} canProceed={Boolean(flooring)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Choose a luxury vinyl plank for your home.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {options.map((opt) => {
          const isSelected = flooring === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setFlooring(opt.id)}
              className={
                `rounded-lg border p-6 text-left transition transform duration-150 hover:scale-105 ` +
                (isSelected
                  ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200'
                  : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50')
              }
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-10 rounded ${opt.swatch} shadow-sm`} />
                <div>
                  <p className="font-semibold">{opt.id}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={confirmFlooring}
          disabled={!flooring}
          className={`px-4 py-2 rounded-md text-white font-medium ${flooring ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Flooring
        </button>

        <button onClick={() => setFlooring(null)} className="px-4 py-2 rounded-md border border-gray-300 text-sm">Clear</button>

        <button onClick={() => navigate('/select-cabinets')} className="ml-auto px-3 py-2 text-sm text-gray-600">Back</button>
      </div>
    </section>
  )
}
