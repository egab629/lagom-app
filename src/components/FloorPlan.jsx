import React from 'react'
import { homeSpecs } from '../data/homes'

export default function FloorPlan({ home }) {
  if (!home?.floorPlan) return null

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{home.id} Floor Plan</h3>
          <p className="text-sm text-gray-600">{homeSpecs(home)} · {home.dimensions}</p>
        </div>
        <a href={home.floorPlan} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-lagom-600 hover:text-lagom-700">
          Open full size
        </a>
      </div>
      {/* natural width, capped to the container, so small plans aren't blown up and blurred */}
      <img src={home.floorPlan} alt={`${home.id} floor plan`} className="mx-auto h-auto max-w-full" />
    </div>
  )
}
