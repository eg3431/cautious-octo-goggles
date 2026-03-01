import { Suspense } from 'react'
import LoginForm from './form'

export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 flex items-center justify-center p-8">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 text-6xl opacity-20 pointer-events-none">🌸</div>
      <div className="fixed bottom-0 right-0 text-6xl opacity-20 pointer-events-none">✦</div>

      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
