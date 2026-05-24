import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/SessionProvider";
import NavBar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FluxGuard",
  description: "Intelligent rate limiting and anomaly detection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}