import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'
import StepNav from '../components/StepNav'

const colors = {
  Oak: 'bg-amber-300',
  White: 'bg-white border border-gray-200',
  Cherry: 'bg-red-700',
}

const styles = ['Mission', 'Traditional']

export default function Step5() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [color, setColor] = useState(selection?.cabinetColor || null)
  const [style, setStyle] = useState(selection?.cabinetStyle || null)

  useEffect(() => {
    if (!selection?.home) {
      navigate('/select-home')
    }
  }, [selection, navigate])

  useEffect(() => {
    setColor(selection?.cabinetColor || null)
    setStyle(selection?.cabinetStyle || null)
  }, [selection?.cabinetColor, selection?.cabinetStyle])

  function confirmCabinets() {
    if (!color || !style) return
    setSelection({
      ...selection,
      cabinetColor: color,
      cabinetStyle: style,
    })
    navigate('/select-flooring')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      cabinetColor: color || prev?.cabinetColor || null,
      cabinetStyle: style || prev?.cabinetStyle || null,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 5 - Select Your Cabinets</h2>
      <StepNav onNext={confirmCabinets} canProceed={Boolean(color && style)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Pick a cabinet color and style for your kitchen.</p>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Color</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.keys(colors).map((c) => {
            const isSelected = color === c
            return (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-lg border p-4 flex items-center gap-4 ${isSelected ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200' : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50'}`}
              >
                <div className={`w-12 h-12 rounded ${colors[c]} shadow-sm`} />
                <div>
                  <p className="font-semibold">{c}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Style</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`rounded-lg border p-4 ${style === s ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200' : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50'}`}
            >
              <p className="font-semibold">{s}</p>
              <p className="text-sm text-gray-500 mt-1">{s} cabinet profile</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={confirmCabinets}
          disabled={!color || !style}
          className={`px-4 py-2 rounded-md text-white font-medium ${color && style ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Cabinets
        </button>

        <button onClick={() => { setColor(null); setStyle(null) }} className="px-4 py-2 rounded-md border border-gray-300 text-sm">Clear</button>

        <button onClick={() => navigate('/select-finish')} className="ml-auto px-3 py-2 text-sm text-gray-600">Back</button>
      </div>
    </section>
  )
}
