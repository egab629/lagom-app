import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'
import StepNav from '../components/StepNav'

const options = [
  { id: 'Granite - Absolute Black', type: 'Granite', swatch: 'bg-black' },
  { id: 'Granite - White Pearl', type: 'Granite', swatch: 'bg-gray-200 border border-gray-300' },
  { id: 'Granite - Ubatuba', type: 'Granite', swatch: 'bg-slate-800' },
  { id: 'Quartz - Carrara', type: 'Quartz', swatch: 'bg-white border border-gray-200' },
  { id: 'Quartz - Calacatta', type: 'Quartz', swatch: 'bg-white/90 border border-gray-200' },
  { id: 'Quartz - Concrete', type: 'Quartz', swatch: 'bg-gray-300' },
]

export default function Step3() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [counter, setCounter] = useState(selection?.counter || null)

  useEffect(() => {
    if (!selection?.home) {
      navigate('/select-home')
    }
  }, [selection, navigate])

  useEffect(() => {
    setCounter(selection?.counter || null)
  }, [selection?.counter])

  function confirmCounter() {
    if (!counter) return
    setSelection({
      ...selection,
      counter,
    })
    navigate('/select-finish')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      counter: counter || prev?.counter || null,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 3 - Select Your Counters</h2>
      <StepNav onNext={confirmCounter} canProceed={Boolean(counter)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Choose the countertop material that matches your kitchen style and lifestyle.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {options.map((opt) => {
          const isSelected = counter === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setCounter(opt.id)}
              aria-pressed={isSelected}
              className={
                `rounded-lg border p-6 text-left transition transform duration-150 hover:scale-105 ` +
                (isSelected
                  ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200'
                  : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50')
              }
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${opt.swatch} shadow-sm`} />
                <div>
                  <p className="font-semibold">{opt.id}</p>
                  <p className="text-sm text-gray-500 mt-1">{opt.type} countertop</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={confirmCounter}
          disabled={!counter}
          className={`px-4 py-2 rounded-md text-white font-medium ${counter ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Counter
        </button>

        <button
          onClick={() => setCounter(null)}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm"
        >
          Clear
        </button>

        <button
          onClick={() => navigate('/configure-home')}
          className="ml-auto px-3 py-2 text-sm text-gray-600"
        >
          Back
        </button>
      </div>
    </section>
  )
}
