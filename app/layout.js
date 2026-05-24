import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FluxGuard",
  description: "Intelligent rate limiting and anomaly detection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">
            Flux<span className="text-orange-500">Guard</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="/dashboard" className="hover:text-white transition">Dashboard</a>
            <a href="/keys" className="hover:text-white transition">API Keys</a>
            <a href="/logs" className="hover:text-white transition">Logs</a>
            <a href="/anomalies" className="hover:text-white transition">Anomalies</a>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Sign In
          </button>
        </nav>
        {children}
      </body>
    </html>
  );
}