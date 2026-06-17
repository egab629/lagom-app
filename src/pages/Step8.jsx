import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'
import StepNav from '../components/StepNav'

const applianceFinishes = ['White', 'Stainless', 'Black']

export default function Step8() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [applianceFinish, setApplianceFinish] = useState(selection?.applianceFinish || null)

  useEffect(() => {
    if (!selection?.home) navigate('/select-home')
    else if (!selection?.sinkType || !selection?.sinkStyle || !selection?.sinkBowls) navigate('/select-sink')
  }, [selection, navigate])

  useEffect(() => {
    setApplianceFinish(selection?.applianceFinish || null)
  }, [selection?.applianceFinish])

  function confirmAppliance() {
    if (!applianceFinish) return
    setSelection({
      ...selection,
      applianceFinish,
    })
    navigate('/dashboard')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      applianceFinish: applianceFinish || prev?.applianceFinish || null,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 8 - Select Appliance Finish</h2>
      <StepNav onNext={confirmAppliance} canProceed={Boolean(applianceFinish)} nextLabel="Finish" onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Choose the finish for your kitchen appliances.</p>

      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {applianceFinishes.map((finishOption) => (
            <button
              key={finishOption}
              type="button"
              onClick={() => setApplianceFinish(finishOption)}
              className={`w-full px-4 py-4 rounded-lg border text-left ${applianceFinish === finishOption ? 'border-lagom-500 bg-lagom-50' : 'border-gray-200 hover:border-lagom-500'}`}
            >
              <span className="block text-lg font-medium">{finishOption}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={confirmAppliance}
          disabled={!applianceFinish}
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium ${applianceFinish ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Appliances
        </button>
        <button
          type="button"
          onClick={() => setApplianceFinish(null)}
          className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 text-sm"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => navigate('/select-sink')}
          className="w-full sm:w-auto ml-auto px-3 py-2 text-sm text-gray-600"
        >
          Back
        </button>
      </div>
    </section>
  )
}
