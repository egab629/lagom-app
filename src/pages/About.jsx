import React from 'react'

const highlights = [
  { title: 'Right-sized homes', body: 'The Lagom 5 designs range from 1,176 to 1,493 sq ft, so you get enough space without paying for more than you need.' },
  { title: 'Built with SIPs', body: 'Structural Insulated Panels make homes faster to build, less costly, and more energy efficient than stick framing.' },
  { title: 'Walkable communities', body: 'Front porches, community gardens, and neighborhoods designed around people, not cars.' },
  { title: 'Land to keys', body: 'Lagom handles land, panel manufacturing, community development, and sales, and sells directly to buyers.' },
]

const communities = [
  { name: 'Oakdale Forest', place: 'Greensboro, GA', body: 'Phase 1 offers 50 single-family cottages, starting at $249,000.' },
]

export default function About() {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-8">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lagom-600">Sustainable · Attainable · Beautiful</p>
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">About Lagom</h2>
        <p className="text-gray-600">
          <span className="italic">Lagom</span> is a Swedish word meaning “just the right amount.” Lagom Development builds
          homes that build futures, restoring homeownership for first-time buyers, essential workers, and working families
          across the Southeast.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-lg border border-lagom-200 bg-lagom-50 p-4">
            <p className="font-semibold text-lagom-700">{h.title}</p>
            <p className="text-sm text-gray-600 mt-1">{h.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Communities</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {communities.map((c) => (
            <div key={c.name} className="rounded-lg border border-gray-200 p-4">
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm font-medium text-lagom-700">{c.place}</p>
              <p className="text-sm text-gray-600 mt-1">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-gray-900">Contact</p>
        <p>8735 Dunwoody PL STE N, Atlanta, GA 30350</p>
        <p>
          <a href="tel:+17708256190" className="text-lagom-700 hover:underline">(770) 825-6190</a>
          {' · '}
          <a href="mailto:via@lagomdevelopment.com" className="text-lagom-700 hover:underline">via@lagomdevelopment.com</a>
        </p>
        <p>
          <a href="https://lagomdevelopment.com" target="_blank" rel="noopener noreferrer" className="text-lagom-700 hover:underline">lagomdevelopment.com</a>
        </p>
      </div>
    </section>
  )
}
