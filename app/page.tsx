'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div></div>
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
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text mb-4">
            ♡ Caption Love ♡
          </h1>
          <p className="text-xl text-purple-800 font-bold tracking-widest">~ Rate captions, upload images ~</p>
          <p className="text-sm text-purple-700 mt-2">キャプションを評価する</p>
        </div>

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
              <h2 className="text-3xl font-black mb-2">RATE</h2>
              <p className="text-lg font-bold">Vote on Captions</p>
              <p className="text-sm mt-4 opacity-90">評価する</p>
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
              <h2 className="text-3xl font-black mb-2">CREATE</h2>
              <p className="text-lg font-bold">Upload Images</p>
              <p className="text-sm mt-4 opacity-90">アップロード</p>
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
              <p className="text-lg font-bold">View All Images</p>
              <p className="text-sm mt-4 opacity-90">画像を見る</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4">
          <p className="text-purple-800 font-bold text-lg">✦ Welcome to Caption Love ✦</p>
          <p className="text-purple-700">~ Express your feelings through captions ~</p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => router.push('/captions')}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-rose-700"
            >
              Start Rating
            </button>
            <button
              onClick={() => router.push('/upload')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-purple-700"
            >
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
