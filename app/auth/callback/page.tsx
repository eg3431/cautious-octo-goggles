'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const finish = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // 🔥 CRITICAL: exchanges ?code= for session cookie
      await supabase.auth.exchangeCodeForSession(window.location.href)

      router.replace('/images')
    }

    finish()
  }, [])

  return <div>Signing you in...</div>
}
