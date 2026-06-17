import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="max-w-2xl space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagom-600">Lagom Home Customization</p>
        <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Design the details of your next Lagom home.</h2>
        <p className="text-gray-600 text-base sm:text-lg">Walk through each selection step, preview your chosen elevation, and save your progress as you customize counters, finishes, cabinets, flooring, sink, and appliances.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/select-home')}
            className="inline-flex items-center justify-center rounded-md bg-lagom-500 px-5 py-3 text-white font-medium transition hover:bg-lagom-600"
          >
            Build My Lagom Home
          </button>
        </div>
      </div>
    </section>
  )
}
