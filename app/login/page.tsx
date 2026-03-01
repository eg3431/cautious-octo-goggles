'use client'

import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function Login() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/images'
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    // Store redirect URL in sessionStorage for callback to retrieve
    sessionStorage.setItem('authRedirect', redirect)
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button onClick={handleLogin}>
      Sign in with Google!!!
    </button>
  )
}
