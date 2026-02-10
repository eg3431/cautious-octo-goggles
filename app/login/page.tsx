'use client'

import { createBrowserClient } from '@supabase/ssr'

export default function Login() {
    console.log("printing keys")
    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
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
