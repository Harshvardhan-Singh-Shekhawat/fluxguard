async function getLogs() {
  const logs = await fetch('http://localhost:3000/api/logs', { cache: 'no-store' }).then(r => r.json())
  return logs
}

export default async function Logs() {
  const logs = await getLogs()

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Request Logs</h1>
            <p className="text-gray-400 mt-1">Full traffic log across all API keys — {logs.length} total requests</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 bg-gray-900">
                <th className="text-left px-6 py-4">ID</th>
                <th className="text-left px-6 py-4">IP Address</th>
                <th className="text-left px-6 py-4">Endpoint</th>
                <th className="text-left px-6 py-4">Method</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Latency</th>
                <th className="text-left px-6 py-4">API Key</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">req_{String(log.id).padStart(3, '0')}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{log.ip}</td>
                  <td className="px-6 py-4 text-blue-400">{log.endpoint}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${
                      log.method === "GET" ? "text-green-400" : "text-yellow-400"
                    }`}>{log.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log.status === "Blocked" ? "bg-red-900 text-red-400" :
                      log.status === "Anomaly" ? "bg-orange-900 text-orange-400" :
                      "bg-green-900 text-green-400"
                    }`}>{log.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{log.latency}ms</td>
                  <td className="px-6 py-4 text-gray-400">{log.apiKey?.name || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}