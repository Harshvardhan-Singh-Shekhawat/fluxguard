'use client'

import { useSession, signOut } from 'next-auth/react'

export default function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold">
        <a href="/">Flux<span className="text-orange-500">Guard</span></a>
      </div>
      <div className="flex gap-6 text-sm text-gray-400">
        <a href="/" className="hover:text-white transition">Home</a>
        <a href="/dashboard" className="hover:text-white transition">Dashboard</a>
        <a href="/keys" className="hover:text-white transition">API Keys</a>
        <a href="/logs" className="hover:text-white transition">Logs</a>
        <a href="/anomalies" className="hover:text-white transition">Anomalies</a>
      </div>
      {session ? (
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">👋 {session.user.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="border border-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 text-sm font-semibold px-4 py-2 rounded-lg transition">
            Sign Out
          </button>
        </div>
      ) : (
        <a href="/signin" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          Sign In
        </a>
      )}
    </nav>
  )
}