'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('')
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?redirect=/upload')
        return
      }
      setAuthenticated(true)
    }
    checkAuth()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError(null)
    setProgress('')

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const token = session.access_token

      // Step 1: Generate presigned URL
      setProgress('Getting upload URL...')
      const presignedRes = await fetch(
        'https://api.almostcrackd.ai/pipeline/generate-presigned-url',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contentType: file.type }),
        }
      )

      if (!presignedRes.ok) {
        throw new Error(`Failed to get presigned URL: ${presignedRes.statusText}`)
      }

      const { presignedUrl, cdnUrl } = await presignedRes.json()

      // Step 2: Upload image to presigned URL
      setProgress('Uploading image...')
      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) {
        throw new Error(`Failed to upload image: ${uploadRes.statusText}`)
      }

      // Step 3: Register image in pipeline
      setProgress('Registering image...')
      const registerRes = await fetch(
        'https://api.almostcrackd.ai/pipeline/upload-image-from-url',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: cdnUrl,
            isCommonUse: false,
          }),
        }
      )

      if (!registerRes.ok) {
        throw new Error(`Failed to register image: ${registerRes.statusText}`)
      }

      const { imageId } = await registerRes.json()

      // Step 4: Generate captions
      setProgress('Generating captions...')
      const captionsRes = await fetch(
        'https://api.almostcrackd.ai/pipeline/generate-captions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageId }),
        }
      )

      if (!captionsRes.ok) {
        throw new Error(`Failed to generate captions: ${captionsRes.statusText}`)
      }

      setProgress('✨ Captions generated! Redirecting...')
      setTimeout(() => {
        router.push('/captions')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return <div></div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text mb-2">
              ♡ Upload Image ♡
            </h1>
            <p className="text-lg text-purple-800 font-bold tracking-widest">~ create new captions ~</p>
            <p className="text-sm text-purple-700 mt-1">画像をアップロード</p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-indigo-700 text-sm h-fit"
          >
            ♡ HOME
          </a>
        </div>

        {/* Upload Form */}
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-rose-300 p-8"
          style={{
            boxShadow: '0 15px 35px rgba(219, 39, 119, 0.25)',
          }}
        >
          <form onSubmit={handleUpload}>
            {/* File Input */}
            <div className="mb-8">
              <label className="block text-center cursor-pointer">
                <div className="border-4 border-dashed border-rose-300 rounded-2xl p-12 hover:border-rose-500 transition-colors">
                  <p className="text-4xl mb-4">🖼️</p>
                  <p className="text-xl font-black text-transparent bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text mb-2">
                    Click to select image
                  </p>
                  <p className="text-sm text-purple-600">
                    JPEG, PNG, WebP, GIF, or HEIC
                  </p>
                  {file && (
                    <p className="text-sm text-green-600 font-bold mt-3">
                      ✓ {file.name}
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
                <p className="text-red-700 font-bold">✦ Error: {error}</p>
              </div>
            )}

            {/* Progress */}
            {progress && (
              <div className="mb-8 p-4 bg-purple-100 border-2 border-purple-500 rounded-lg">
                <p className="text-purple-700 font-bold">✦ {progress}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-500 hover:from-rose-600 hover:via-rose-700 hover:to-red-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-black py-4 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-rose-700 disabled:border-gray-500"
            >
              {loading ? '⏳ Generating...' : '♡ Generate Captions'}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-purple-300 shadow-lg">
          <p className="text-purple-800 font-bold text-center mb-3">✦ How it works ✦</p>
          <ol className="text-sm text-purple-700 space-y-2">
            <li>1️⃣ Upload your image</li>
            <li>2️⃣ Our AI generates captions</li>
            <li>3️⃣ Rate the captions with your heart ♡</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
