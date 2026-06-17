import React, { useState, useEffect } from 'react'
import StepNav from '../components/StepNav'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'

const previewMap = {
  'Left-1': new URL('../assets/preview-left-1.svg', import.meta.url).href,
  'Left-2': new URL('../assets/preview-left-2.svg', import.meta.url).href,
  'Left-3': new URL('../assets/preview-left-3.svg', import.meta.url).href,
  'Left-4': new URL('../assets/preview-left-4.svg', import.meta.url).href,
  'Right-1': new URL('../assets/preview-right-1.svg', import.meta.url).href,
  'Right-2': new URL('../assets/preview-right-2.svg', import.meta.url).href,
  'Right-3': new URL('../assets/preview-right-3.svg', import.meta.url).href,
  'Right-4': new URL('../assets/preview-right-4.svg', import.meta.url).href,
}

const homeStyles = {
  'Cozy Cottage': {
    ring: 'ring-emerald-200',
    label: 'bg-emerald-100 text-emerald-800',
    accent: 'from-emerald-50 to-emerald-100',
  },
  'Urban Loft': {
    ring: 'ring-slate-200',
    label: 'bg-slate-100 text-slate-800',
    accent: 'from-slate-50 to-slate-100',
  },
  'Modern Farmhouse': {
    ring: 'ring-amber-200',
    label: 'bg-amber-100 text-amber-800',
    accent: 'from-amber-50 to-amber-100',
  },
  'Beach Bungalow': {
    ring: 'ring-cyan-200',
    label: 'bg-cyan-100 text-cyan-800',
    accent: 'from-cyan-50 to-cyan-100',
  },
}

export default function Step2() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [layout, setLayout] = useState(selection?.layout || 'Left')
  const [elevation, setElevation] = useState(selection?.elevation || '1')

  useEffect(() => {
    if (!selection?.home) {
      navigate('/select-home')
    }
  }, [selection, navigate])

  useEffect(() => {
    setLayout(selection?.layout || 'Left')
    setElevation(selection?.elevation || '1')
  }, [selection?.layout, selection?.elevation])

  function confirmConfiguration() {
    if (!selection?.home) return
    setSelection({
      ...selection,
      layout,
      elevation,
    })
    navigate('/select-counter')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      layout,
      elevation,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 2 - Configure Your Lagom Home</h2>
      <StepNav onNext={confirmConfiguration} canProceed={Boolean(selection?.home && layout && elevation)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Pick the layout and elevation for your selected home.</p>

      <div className="grid gap-6 mb-6">
        <div className={`rounded-2xl border border-gray-200 bg-slate-50 p-4 ${homeStyles[selection?.home]?.ring || ''}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Preview</p>
              <p className="text-lg font-semibold text-slate-900">{selection?.home || 'Home'} • {layout} • Elevation {elevation}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm ${homeStyles[selection?.home]?.label || 'bg-slate-100 text-slate-700'}`}>
                {selection?.home || 'Selected Home'}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">Live</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src={previewMap[`${layout}-${elevation}`]}
              alt={`${selection?.home || 'Home'} - ${layout} layout, elevation ${elevation} preview`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className={`mt-4 rounded-xl px-4 py-3 text-sm text-slate-700 bg-gradient-to-r ${homeStyles[selection?.home]?.accent || 'from-slate-50 to-slate-100'}`}>
            This preview shows the {selection?.home || 'selected home'} style with the chosen layout and elevation.
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Layout</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Left', 'Right'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLayout(option)}
                className={`rounded-lg border p-4 text-left transition duration-150 ${layout === option ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200' : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50'}`}
              >
                <p className="font-semibold">{option} Layout</p>
                <p className="text-sm text-gray-500 mt-1">Choose the {option.toLowerCase()} floorplan.</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Elevation</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {['1', '2', '3', '4'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setElevation(option)}
                className={`rounded-lg border p-4 transition duration-150 ${elevation === option ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200' : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50'}`}
              >
                <p className="font-semibold">Elevation {option}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={confirmConfiguration}
          className="px-4 py-2 rounded-md bg-lagom-500 text-white hover:bg-lagom-600 font-medium"
        >
          Confirm Home Configuration
        </button>
        <button
          onClick={() => navigate('/select-home')}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm"
        >
          Change Home
        </button>
      </div>
    </section>
  )
}
