import React, { useState, useEffect } from 'react'
import StepNav from '../components/StepNav'
import { useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'

const finishColors = {
  'Brass': 'bg-yellow-600',
  'Bronze': 'bg-amber-800',
  'Brushed Nickel': 'bg-gray-400',
  'Chrome': 'bg-gray-300',
}

export default function Step4() {
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const [finish, setFinish] = useState(selection?.finish || null)

  useEffect(() => {
    if (!selection?.home) {
      navigate('/select-home')
    }
  }, [selection, navigate])

  useEffect(() => {
    setFinish(selection?.finish || null)
  }, [selection?.finish])

  function confirmFinish() {
    if (!finish) return
    setSelection({
      ...selection,
      finish,
    })
    navigate('/select-cabinets')
  }

  function saveAndExit() {
    setSelection((prev) => ({
      ...prev,
      finish: finish || prev?.finish || null,
    }))
    navigate('/dashboard')
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Step 4 - Select Your Finish</h2>
      <StepNav onNext={confirmFinish} canProceed={Boolean(finish)} onSaveExit={saveAndExit} />
      <p className="text-gray-600 mb-6">Choose the hardware finish that complements your Lagom home style.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {Object.keys(finishColors).map((finishOption) => {
          const isSelected = finish === finishOption
          return (
            <button
              key={finishOption}
              onClick={() => setFinish(finishOption)}
              aria-pressed={isSelected}
              className={
                `rounded-lg border p-6 text-left transition transform duration-150 hover:scale-105 ` +
                (isSelected
                  ? 'border-lagom-500 bg-lagom-50 ring-2 ring-lagom-200'
                  : 'border-gray-200 hover:border-lagom-500 hover:bg-lagom-50')
              }
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${finishColors[finishOption]} shadow-sm`}></div>
                <div>
                  <p className="font-semibold">{finishOption}</p>
                  <p className="text-sm text-gray-500 mt-1">Premium hardware finish</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={confirmFinish}
          disabled={!finish}
          className={`px-4 py-2 rounded-md text-white font-medium ${finish ? 'bg-lagom-500 hover:bg-lagom-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Confirm Finish
        </button>

        <button
          onClick={() => setFinish(null)}
          className="px-4 py-2 rounded-md border border-gray-300 text-sm"
        >
          Clear
        </button>

        <button
          onClick={() => navigate('/select-counter')}
          className="ml-auto px-3 py-2 text-sm text-gray-600"
        >
          Back
        </button>
      </div>
    </section>
  )
}
