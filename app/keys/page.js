export default function APIKeys() {
  const keys = [
    { name: "Production App", key: "fg_live_xK9...3mN", requests: "842,291", limit: "1,000,000", status: "Active", created: "Jan 12, 2025" },
    { name: "Staging Server", key: "fg_live_pR2...7qL", requests: "124,882", limit: "500,000", status: "Active", created: "Feb 3, 2025" },
    { name: "Mobile App", key: "fg_live_tY5...9wX", requests: "489,103", limit: "500,000", status: "Near Limit", created: "Mar 18, 2025" },
    { name: "Test Environment", key: "fg_test_hJ8...2kP", requests: "12,400", limit: "50,000", status: "Active", created: "Apr 1, 2025" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-gray-400 mt-1">Manage and monitor your API keys</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition">
            + Create New Key
          </button>
        </div>

        <div className="grid gap-4">
          {keys.map((k) => (
            <div key={k.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{k.name}</h3>
                  <p className="text-gray-500 text-sm font-mono mt-1">{k.key}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  k.status === "Near Limit"
                    ? "bg-orange-900 text-orange-400"
                    : "bg-green-900 text-green-400"
                }`}>
                  {k.status}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Requests used</span>
                  <span>{k.requests} / {k.limit}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      k.status === "Near Limit" ? "bg-orange-500" : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (parseInt(k.requests.replace(/,/g, "")) /
                          parseInt(k.limit.replace(/,/g, ""))) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs">Created {k.created}</p>
                <div className="flex gap-2">
                  <button className="text-xs border border-gray-700 hover:border-orange-500 text-gray-400 hover:text-orange-400 px-3 py-1 rounded-lg transition">
                    Copy Key
                  </button>
                  <button className="text-xs border border-gray-700 hover:border-red-500 text-gray-400 hover:text-red-400 px-3 py-1 rounded-lg transition">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}