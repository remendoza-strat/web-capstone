import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjectFlow",
  description: "Team collaboration and project management platform.",
  generator: "v0.dev"
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
    </ClerkProvider>
  );
}