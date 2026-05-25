'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const IPS = ['192.168.1.1', '10.0.0.45', '172.16.0.8', '203.0.113.5', '198.51.100.2', '1.2.3.4']
const ENDPOINTS = ['/api/login', '/api/data', '/api/upload', '/api/auth']
const METHODS = ['GET', 'POST']

export default function SimulateButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const router = useRouter()

  async function simulate() {
    setLoading(true)
    setResult('')

    let blocked = 0
    let allowed = 0

    for (let i = 0; i < 25; i++) {
      const ip = IPS[Math.floor(Math.random() * IPS.length)]
      const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)]
      const method = METHODS[Math.floor(Math.random() * METHODS.length)]

      const res = await fetch('/api/ratelimit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, endpoint, method, apiKeyId: 1 }),
      })

      const data = await res.json()
      if (data.allowed) allowed++
      else blocked++

      await new Promise(r => setTimeout(r, 100))
    }

    setResult(`✅ Done! ${allowed} allowed, ${blocked} blocked — dashboard updated!`)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={simulate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 text-sm">
        {loading ? '⚡ Simulating traffic...' : '⚡ Simulate Live Traffic'}
      </button>
      {result && <p className="text-green-400 text-sm">{result}</p>}
    </div>
  )
}