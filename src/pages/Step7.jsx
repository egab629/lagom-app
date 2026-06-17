import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'
import StepNav from '../components/StepNav'

const sinkTypes = ['Stainless', 'Ceramic']
const sinkStyles = ['Undermount', 'Farmhouse']
const sinkBowls = ['Single', 'Double']

export default function Step7() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [type, setType] = useState(selection?.sinkType || null)
  const [style, setStyle] = useState(selection?.sinkStyle || null)
  const [bowls, setBowls] = useState(selection?.sinkBowls || null)

  useEffect(() => {
    if (!selection?.home) navigate('/select-home')
  }, [selection, navigate])

  useEffect(() => {
    setType(selection?.sinkType || null)
    setStyle(selection?.sinkStyle || null)
    setBowls(selection?.sinkBowls || null)
  }, [selection?.sinkType, selection?.sinkStyle, selection?.sinkBowls])

  function confirmSink() {
    if (!type || !style || !bowls) return
    setSelection({
      ...selection,
      sinkType: type,
      sinkStyle: style,
      sinkBowls: bowls,
    })
    navigate('/select-appliances')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      sinkType: type || prev?.sinkType || null,
      sinkStyle: style || prev?.sinkStyle || null,
      sinkBowls: bowls || prev?.sinkBowls || null,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 7 - Select Your Kitchen Sink</h2>
      <StepNav onNext={confirmSink} canProceed={Boolean(type && style && bowls)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Choose sink type, style, and bowl configuration.</p>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Type</h3>
        <div className="flex gap-4">
          {sinkTypes.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded border ${type === t ? 'border-lagom-500 bg-lagom-50' : 'border-gray-200 hover:border-lagom-500'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Style</h3>
        <div className="flex gap-4">
          {sinkStyles.map((s) => (
            <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded border ${style === s ? 'border-lagom-500 bg-lagom-50' : 'border-gray-200 hover:border-lagom-500'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Bowls</h3>
        <div className="flex gap-4 flex-wrap">
          {sinkBowls.map((b) => (
            <button key={b} onClick={() => setBowls(b)} className={`px-4 py-2 rounded border ${bowls === b ? 'border-lagom-500 bg-lagom-50' : 'border-gray-200 hover:border-lagom-500'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button onClick={confirmSink} disabled={!type || !style || !bowls} className={`px-4 py-2 rounded-md text-white font-medium ${type && style && bowls ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}>
          Next: Appliances
        </button>

        <button onClick={() => { setType(null); setStyle(null); setBowls(null) }} className="px-4 py-2 rounded-md border border-gray-300 text-sm">Clear</button>

        <button onClick={() => navigate('/select-flooring')} className="ml-auto px-3 py-2 text-sm text-gray-600">Back</button>
      </div>
    </section>
  )
}
