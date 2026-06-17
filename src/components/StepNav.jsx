import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelection } from '../state/SelectionProvider'

const steps = [
  { path: '/select-home', label: '1. Select Home' },
  { path: '/configure-home', label: '2. Configure' },
  { path: '/select-counter', label: '3. Counters' },
  { path: '/select-finish', label: '4. Finishes' },
  { path: '/select-cabinets', label: '5. Cabinets' },
  { path: '/select-flooring', label: '6. Flooring' },
  { path: '/select-sink', label: '7. Sink' },
  { path: '/select-appliances', label: '8. Appliances' },
]

export default function StepNav({ onNext, canProceed, nextLabel = 'Next', onSaveExit } = {}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { selection, setSelection } = useSelection()
  const idx = steps.findIndex(s => s.path === location.pathname)

  useEffect(() => {
    if (idx === -1) return
    setSelection((prev) => {
      if (!prev || prev.lastStep === location.pathname) return prev
      return { ...prev, lastStep: location.pathname }
    })
  }, [idx, location.pathname, setSelection])

  if (idx === -1) return null

  const prev = idx > 0 ? steps[idx - 1].path : null
  const next = idx < steps.length - 1 ? steps[idx + 1].path : null

  function requirementSatisfied(stepIndex) {
    if (!selection) return false
    switch (stepIndex) {
      case 0:
        return Boolean(selection.home)
      case 1:
        return Boolean(selection.layout && selection.elevation)
      case 2:
        return Boolean(selection.counter)
      case 3:
        return Boolean(selection.finish)
      case 4:
        return Boolean(selection.cabinetColor && selection.cabinetStyle)
      case 5:
        return Boolean(selection.flooring)
      case 6:
        return Boolean(selection.sinkType && selection.sinkStyle && selection.sinkBowls)
      case 7:
        return Boolean(selection.applianceFinish)
      default:
        return true
    }
  }

  function canNavigateTo(targetIndex) {
    // allow navigating to any completed or current step; prevent jumping ahead past incomplete steps
    if (targetIndex <= idx) return true
    for (let i = 0; i < targetIndex; i++) {
      if (!requirementSatisfied(i)) return false
    }
    return true
  }

  const hasForwardAction = Boolean(next || typeof onNext === 'function')
  const canMoveForward = typeof canProceed === 'boolean' ? canProceed : requirementSatisfied(idx)
  const nextEnabled = Boolean(hasForwardAction && canMoveForward)
  const saveExitEnabled = typeof onSaveExit === 'function'

  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {steps.map((s, i) => (
            <button
              key={s.path}
              type="button"
              onClick={() => canNavigateTo(i) && navigate(s.path)}
              className={
                `px-2 py-1 rounded text-sm ${i === idx ? 'bg-lagom-600 text-white' : canNavigateTo(i) ? 'text-gray-600 hover:bg-lagom-50' : 'text-gray-300 cursor-not-allowed'}`
              }
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onSaveExit && onSaveExit()}
          disabled={!saveExitEnabled}
          className={`w-full sm:w-auto px-3 py-2 rounded border ${saveExitEnabled ? 'text-lagom-700 border-lagom-300 hover:bg-lagom-50' : 'text-gray-300 border-gray-200 cursor-not-allowed'}`}
        >
          Save and Exit
        </button>
        <button
          type="button"
          onClick={() => prev && navigate(prev)}
          disabled={!prev}
          className={`w-full sm:w-auto px-3 py-2 rounded border ${prev ? 'text-gray-700' : 'text-gray-300 cursor-not-allowed'}`}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => {
            if (!nextEnabled) return
            if (typeof onNext === 'function') {
              onNext()
            } else if (next) {
              navigate(next)
            }
          }}
          disabled={!nextEnabled}
          className={`w-full sm:w-auto px-3 py-2 rounded bg-lagom-500 text-white ${nextEnabled ? 'hover:bg-lagom-600' : 'opacity-50 cursor-not-allowed'}`}
        >
          {next ? nextLabel : 'Finish'}
        </button>
      </div>
    </div>
  )
}
