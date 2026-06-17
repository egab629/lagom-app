import React, { useState, useEffect } from 'react'
import StepNav from '../components/StepNav'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'

export default function Step1() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [selected, setSelected] = useState(selection?.home || null)

  const choices = ['Cozy Cottage', 'Urban Loft', 'Modern Farmhouse', 'Beach Bungalow']

  useEffect(() => {
    if (selected) {
      setSelection({ ...selection, home: selected })
    }
  }, [selected])

  function confirmSelection() {
    if (!selected) return
    navigate('/configure-home')
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

      <div className="grid gap-4 sm:grid-cols-2">
        {choices.map((choice) => {
          const isSelected = selected === choice
          return (
            <button
              key={choice}
              onClick={() => setSelected(choice)}
              aria-pressed={isSelected}
              className={
                `rounded-lg border p-4 text-left transition transform duration-150 hover:scale-105 ` +
                (isSelected
                  ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200'
                  : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50')
              }
            >
              <p className="font-semibold">{choice}</p>
              <p className="text-sm text-gray-500 mt-1">A thoughtful home for your Lagom lifestyle.</p>
            </button>
          )
        })}
      </div>

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
