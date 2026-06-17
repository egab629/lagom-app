import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Step1 from './pages/Step1'
import Step2 from './pages/Step2'
import Step3 from './pages/Step3'
import Step4 from './pages/Step4'
import Step5 from './pages/Step5'
import Step6 from './pages/Step6'
import Step7 from './pages/Step7'
import Step8 from './pages/Step8'
import Dashboard from './pages/Dashboard'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import SelectionProvider from './state/SelectionProvider'

function PrivateRoute({ children }) {
  const { user, initializing } = useAuth()

  if (initializing) {
    return <div className="text-center py-20 text-gray-600">Loading...</div>
  }

  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <SelectionProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Nav />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/select-home" element={<PrivateRoute><Step1 /></PrivateRoute>} />
                <Route path="/configure-home" element={<PrivateRoute><Step2 /></PrivateRoute>} />
                <Route path="/select-counter" element={<PrivateRoute><Step3 /></PrivateRoute>} />
                <Route path="/select-finish" element={<PrivateRoute><Step4 /></PrivateRoute>} />
                <Route path="/select-cabinets" element={<PrivateRoute><Step5 /></PrivateRoute>} />
                <Route path="/select-flooring" element={<PrivateRoute><Step6 /></PrivateRoute>} />
                <Route path="/select-sink" element={<PrivateRoute><Step7 /></PrivateRoute>} />
                <Route path="/select-appliances" element={<PrivateRoute><Step8 /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SelectionProvider>
    </AuthProvider>
  )
}
