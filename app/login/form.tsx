'use client'

import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    // Store redirect URL in sessionStorage for callback to retrieve
    sessionStorage.setItem('authRedirect', redirect)

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full">
      {/* Card */}
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-rose-300 p-12"
        style={{
          boxShadow: '0 20px 60px rgba(219, 39, 119, 0.35), inset 0 1px 0 rgba(255,255,255,0.6)'
        }}
      >
        {/* Decorative top */}
        <div className="text-center mb-4">
          <p className="text-5xl mb-4">♡</p>
          <p className="text-sm text-purple-600 font-bold tracking-widest mb-2">━━━━━✦━━━━━</p>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-center text-transparent bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text mb-2">
          Welcome
        </h1>
        <p className="text-center text-lg text-purple-700 font-bold mb-2">♡ キャプション ♡</p>
        <p className="text-center text-sm text-purple-600 mb-8">Sign in to rate AI-generated captions</p>

        <div className="mb-6 rounded-xl border border-indigo-300 bg-indigo-50 p-3 text-sm text-indigo-900">
          <p className="font-semibold">After sign-in you will go to the home page.</p>
          <p className="mt-1">On mobile, use Google autofill/keychain for faster login.</p>
        </div>

        {/* Decorative divider */}
        <p className="text-center text-sm text-purple-600 font-bold mb-8">━━━━━✦━━━━━</p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-br from-rose-400 via-rose-500 to-red-500 hover:from-rose-500 hover:via-rose-600 hover:to-red-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-black py-4 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-rose-700 disabled:border-gray-500 mb-6"
        >
          {loading ? '⏳ Connecting to Google...' : '✦ Continue with Google'}
        </button>

        {error && (
          <div className="mb-6 rounded-xl border-2 border-red-400 bg-red-50 p-3 text-sm text-red-800">
            <p className="font-bold">Sign-in failed</p>
            <p>{error}</p>
            <p className="mt-1">Please try again. If the pop-up was blocked, allow it and retry.</p>
          </div>
        )}

        {/* Info */}
        <div className="text-center space-y-3">
          <p className="text-sm text-purple-700 font-semibold">Secure login powered by Google OAuth</p>
          <div className="flex justify-center gap-2 text-2xl">
            <span>♡</span>
            <span>✦</span>
            <span>♡</span>
          </div>
        </div>

        {/* Footer decoration */}
        <p className="text-center text-xs text-purple-600 font-bold mt-8">━━━━━✦━━━━━</p>
        <p className="text-center text-xs text-purple-600 mt-3">彼らのストーリーを感じてください</p>
      </div>

      {/* Bottom text */}
      <p className="text-center text-purple-700 font-bold mt-8 text-sm">
        ~ feel their stories ~
      </p>
    </div>
  )
}
