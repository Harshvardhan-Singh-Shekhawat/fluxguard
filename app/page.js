export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
          Cloudflare-style Traffic Intelligence
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Flux<span className="text-orange-500">Guard</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Intelligent rate limiting and anomaly detection for your APIs. 
          Monitor traffic patterns, detect threats, and protect your infrastructure in real time.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition">
            Get Started
          </button>
          <button className="border border-gray-700 hover:border-orange-500 text-gray-300 font-semibold px-6 py-3 rounded-lg transition">
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}