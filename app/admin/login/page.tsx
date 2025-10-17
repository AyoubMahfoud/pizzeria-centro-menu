'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ChefHat } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Errore durante il login')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('Errore di connessione')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative w-full max-w-md">
        {/* Premium Logo Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>

            {/* Logo */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 via-red-500 to-orange-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent mb-2">
            Admin Access
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500"></div>
            <p className="text-gray-400 text-sm font-light tracking-widest uppercase">Pizzeria Centro</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500"></div>
          </div>
        </div>

        {/* Premium Glassmorphism Form */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20"></div>

          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              {error && (
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-serif font-semibold text-gray-900">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-gray-900 bg-white font-light placeholder:text-gray-400"
                      placeholder="admin@pizzeriacentro.it"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-serif font-semibold text-gray-900">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-gray-900 bg-white font-light placeholder:text-gray-400"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-600"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                <div className="relative flex items-center justify-center gap-3 px-6 py-4">
                  {loading && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span className="text-base font-serif font-semibold text-white tracking-wide">
                    {loading ? 'Verifica in corso...' : 'Accedi al Pannello'}
                  </span>
                </div>
              </button>
            </form>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                <span className="font-light">Connessione sicura e criptata</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
