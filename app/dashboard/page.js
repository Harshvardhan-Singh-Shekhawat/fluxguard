import { RequestsLineChart, StatusBarChart } from '../components/Charts'

async function getStats() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
    
  const [logs, keys, anomalies] = await Promise.all([
    fetch(`${baseUrl}/api/logs`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${baseUrl}/api/keys`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${baseUrl}/api/anomalies`, { cache: 'no-store' }).then(r => r.json()),
  ])
  return { logs, keys, anomalies }
}

export default async function Dashboard() {
  const { logs, keys, anomalies } = await getStats()

  const totalRequests = logs.length
  const blockedRequests = logs.filter(l => l.status === 'Blocked').length
  const anomalyCount = anomalies.length
  const activeKeys = keys.filter(k => k.isActive).length

  const stats = [
    { label: "Total Requests", value: totalRequests.toLocaleString(), change: "Live from DB", color: "text-blue-400" },
    { label: "Blocked Requests", value: blockedRequests.toLocaleString(), change: "Live from DB", color: "text-red-400" },
    { label: "Anomalies Detected", value: anomalyCount.toString(), change: "Live from DB", color: "text-orange-400" },
    { label: "Active API Keys", value: activeKeys.toString(), change: "Live from DB", color: "text-green-400" },
  ]

  const statusData = [
    { status: 'Allowed', count: logs.filter(l => l.status === 'Allowed').length },
    { status: 'Blocked', count: logs.filter(l => l.status === 'Blocked').length },
    { status: 'Anomaly', count: logs.filter(l => l.status === 'Anomaly').length },
  ]

  const hourCounts = {}
  logs.forEach(log => {
    const hour = new Date(log.createdAt).getHours()
    const key = `${hour}:00`
    hourCounts[key] = (hourCounts[key] || 0) + 1
  })
  const lineData = Object.entries(hourCounts)
    .map(([time, requests]) => ({ time, requests }))
    .sort((a, b) => parseInt(a.time) - parseInt(b.time))

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time traffic overview for your APIs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6">Requests Over Time</h2>
            <RequestsLineChart data={lineData} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6">Request Status Breakdown</h2>
            <StatusBarChart data={statusData} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Request Logs</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left pb-3">IP Address</th>
                <th className="text-left pb-3">Endpoint</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Latency</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((log) => (
                <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="py-3 text-gray-300 font-mono">{log.ip}</td>
                  <td className="py-3 text-blue-400">{log.endpoint}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log.status === "Blocked" ? "bg-red-900 text-red-400" :
                      log.status === "Anomaly" ? "bg-orange-900 text-orange-400" :
                      "bg-green-900 text-green-400"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{log.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}