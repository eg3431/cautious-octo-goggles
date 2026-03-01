'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-black rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-slate-700 text-sm"
    >
      ✦ QUIT
    </button>
  )
}
