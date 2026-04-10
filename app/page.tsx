'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import LogoutButton from '@/app/components/LogoutButton'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user)
      setLoading(false)

      const onboardingSeen = localStorage.getItem('caption-love-onboarding-seen')
      if (!onboardingSeen) {
        setShowOnboarding(true)
      }
    }
    checkAuth()
  }, [])

  const dismissOnboarding = () => {
    localStorage.setItem('caption-love-onboarding-seen', '1')
    setShowOnboarding(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-4xl mb-3">⏳</p>
          <p className="text-purple-800 font-bold">Loading your caption studio...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    router.push('/login')
    return <div></div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 p-8">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 text-6xl opacity-20 pointer-events-none">🌸</div>
      <div className="fixed bottom-0 right-0 text-6xl opacity-20 pointer-events-none">✦</div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex justify-end mb-4">
            <LogoutButton />
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text mb-4">
              ♡ Caption Love ♡
            </h1>
            <p className="text-xl text-purple-800 font-bold tracking-widest">Rate AI-generated captions for images</p>
            <p className="text-sm text-purple-700 mt-2">Upload a photo, get AI captions, then vote love or pass.</p>
          </div>
        </div>

        {showOnboarding && (
          <section className="mb-10 bg-white/90 rounded-2xl border-2 border-purple-300 shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-wider text-purple-600 uppercase mb-2">First time here?</p>
                <h2 className="text-2xl font-black text-purple-900 mb-2">How Caption Love works</h2>
                <ul className="text-purple-800 text-sm md:text-base space-y-2">
                  <li>1. Upload an image or pick existing ones.</li>
                  <li>2. AI generates multiple captions for each image.</li>
                  <li>3. Vote on captions with LOVE or PASS to improve ranking.</li>
                </ul>
                <p className="text-xs text-purple-700 mt-3">Tip: Use captions that are funny, fitting, or most shareable.</p>
              </div>
              <button
                onClick={dismissOnboarding}
                className="self-start px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full"
              >
                Start Exploring
              </button>
            </div>
          </section>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Captions Card */}
          <button
            onClick={() => router.push('/captions')}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-rose-300 hover:border-rose-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-purple-300 to-rose-400"></div>
            <div className="relative h-full flex flex-col justify-center items-center p-8 text-white">
              <p className="text-6xl mb-4">♡</p>
              <h2 className="text-3xl font-black mb-2">VOTE</h2>
              <p className="text-lg font-bold">Rate AI Captions</p>
              <p className="text-sm mt-4 opacity-90">Love or pass each caption</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>

          {/* Upload Card */}
          <button
            onClick={() => router.push('/upload')}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-300 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-indigo-300 to-purple-400"></div>
            <div className="relative h-full flex flex-col justify-center items-center p-8 text-white">
              <p className="text-6xl mb-4">🖼️</p>
              <h2 className="text-3xl font-black mb-2">UPLOAD</h2>
              <p className="text-lg font-bold">Generate New Captions</p>
              <p className="text-sm mt-4 opacity-90">Choose a photo and create caption options</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>

          {/* Images Card */}
          <button
            onClick={() => router.push('/images')}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-300 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-blue-300 to-indigo-400"></div>
            <div className="relative h-full flex flex-col justify-center items-center p-8 text-white">
              <p className="text-6xl mb-4">🖼️</p>
              <h2 className="text-3xl font-black mb-2">BROWSE</h2>
              <p className="text-lg font-bold">View Image Feed</p>
              <p className="text-sm mt-4 opacity-90">See what the community is captioning</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4">
          <p className="text-purple-800 font-bold text-lg">✦ You are rating AI-generated caption ideas ✦</p>
          <p className="text-purple-700">Actions save automatically and you can jump between screens anytime.</p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => router.push('/captions')}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-rose-700"
            >
              Start Voting
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
