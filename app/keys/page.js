'use client'

import { useState, useEffect } from 'react'

export default function APIKeys() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchKeys()
  }, [])

  async function fetchKeys() {
    const res = await fetch('/api/keys')
    const data = await res.json()
    setKeys(data)
    setLoading(false)
  }

  async function createKey() {
    if (!newKeyName.trim()) return
    setCreating(true)
    await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName, tier: 'free', limit: 10000 }),
    })
    setNewKeyName('')
    setShowForm(false)
    setCreating(false)
    fetchKeys()
  }

  async function revokeKey(id) {
    await fetch(`/api/keys/${id}`, { method: 'DELETE' })
    fetchKeys()
  }

  function copyKey(key, id) {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-gray-400 mt-1">Manage and monitor your API keys</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition">
            + Create New Key
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">Create New API Key</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name e.g. Production App"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={createKey}
                disabled={creating}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50">
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="border border-gray-700 text-gray-400 px-4 py-2 rounded-lg transition hover:border-gray-500">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {keys.map((k) => (
            <div key={k.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{k.name}</h3>
                  <p className="text-gray-500 text-sm font-mono mt-1">
                    {k.key.substring(0, 20)}...
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  k.isActive ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
                }`}>
                  {k.isActive ? 'Active' : 'Revoked'}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Requests used</span>
                  <span>{k.logs?.length || 0} / {k.limit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(((k.logs?.length || 0) / k.limit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs">
                  Created {new Date(k.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyKey(k.key, k.id)}
                    className="text-xs border border-gray-700 hover:border-orange-500 text-gray-400 hover:text-orange-400 px-3 py-1 rounded-lg transition">
                    {copiedId === k.id ? 'Copied!' : 'Copy Key'}
                  </button>
                  {k.isActive && (
                    <button
                      onClick={() => revokeKey(k.id)}
                      className="text-xs border border-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 px-3 py-1 rounded-lg transition">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}