import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Nav() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="bg-lagom-600 shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" onClick={closeMenu} className="text-xl font-bold text-white">Lagom</Link>

          <nav className="hidden md:flex space-x-2">
            <NavLink to="/" className={({isActive}) => (isActive ? 'text-white font-semibold px-3 py-2 rounded' : 'text-green-100 px-3 py-2 rounded hover:text-white')}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => (isActive ? 'text-white font-semibold px-3 py-2 rounded' : 'text-green-100 px-3 py-2 rounded hover:text-white')}>About</NavLink>
            {user ? (
              <NavLink to="/dashboard" className={({isActive}) => (isActive ? 'text-white font-semibold px-3 py-2 rounded' : 'text-green-100 px-3 py-2 rounded hover:text-white')}>Dashboard</NavLink>
            ) : (
              <NavLink to="/login" className={({isActive}) => (isActive ? 'text-white font-semibold px-3 py-2 rounded' : 'text-green-100 px-3 py-2 rounded hover:text-white')}>Sign in</NavLink>
            )}
          </nav>

          <div className="md:hidden relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 bg-lagom-50 hover:bg-lagom-100"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white border border-gray-200 shadow-lg">
                <Link to="/" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-lagom-50">Home</Link>
                <Link to="/about" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-lagom-50">About</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-lagom-50">Dashboard</Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu()
                        logout()
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-lagom-50"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-lagom-50">Sign in</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
