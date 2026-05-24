async function getAnomalies() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const anomalies = await fetch(`${baseUrl}/api/anomalies`, { cache: 'no-store' }).then(r => r.json())
  return anomalies
}

export default async function Anomalies() {
  const anomalies = await getAnomalies()
  const critical = anomalies.filter(a => a.severity === 'Critical').length
  const high = anomalies.filter(a => a.severity === 'High').length
  const monitoring = anomalies.filter(a => a.status === 'Monitoring').length
  const severityStyle = {
    Critical: "bg-red-900 text-red-400",
    High: "bg-orange-900 text-orange-400",
    Medium: "bg-yellow-900 text-yellow-400",
    Low: "bg-blue-900 text-blue-400",
  }
  const statusStyle = {
    "Auto-Blocked": "bg-red-900 text-red-400",
    "Flagged": "bg-orange-900 text-orange-400",
    "Monitoring": "bg-blue-900 text-blue-400",
  }
  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Anomalies</h1>
          <p className="text-gray-400 mt-1">AI-detected traffic anomalies and threats</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-red-950 border border-red-900 rounded-xl p-4 text-center">
            <p className="text-red-400 text-2xl font-bold">{critical}</p>
            <p className="text-red-300 text-sm mt-1">Critical</p>
          </div>
          <div className="bg-orange-950 border border-orange-900 rounded-xl p-4 text-center">
            <p className="text-orange-400 text-2xl font-bold">{high}</p>
            <p className="text-orange-300 text-sm mt-1">High</p>
          </div>
          <div className="bg-blue-950 border border-blue-900 rounded-xl p-4 text-center">
            <p className="text-blue-400 text-2xl font-bold">{monitoring}</p>
            <p className="text-blue-300 text-sm mt-1">Monitoring</p>
          </div>
        </div>
        <div className="grid gap-4">
          {anomalies.map((a) => (
            <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-white">{a.type}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityStyle[a.severity]}`}>
                      {a.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{a.description}</p>
                </div>
                <p className="text-gray-500 text-xs font-mono">
                  {new Date(a.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-6 text-sm text-gray-400 mt-4">
                <span>🌐 <span className="font-mono text-gray-300">{a.ip}</span></span>
                <span>📍 <span className="text-blue-400">{a.endpoint}</span></span>
                <span>📊 <span className="text-gray-300">{a.requests}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}