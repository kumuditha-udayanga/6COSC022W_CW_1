import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RestCountries",
  description: "Search information of your favourite countries",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right"  richColors/>
        </AuthProvider>
      </body>
    </html>
  )
}
