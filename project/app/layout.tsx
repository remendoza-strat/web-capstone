import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { TanstackProvider } from "@/app/tanstack-provider"

// Load inter font
const inter = Inter({ subsets: ["latin"] });

// Set app metadata
export const metadata: Metadata = {
  title: "ProjectFlow",
  description: "Team collaboration and project management platform.",
  generator: "v0.dev"
}

// Wrap app components with providers
export default function RootLayout({ children }: { children: React.ReactNode }){
  return(
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <TanstackProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </TanstackProvider>
          <Toaster richColors position="bottom-right"/>
        </body>
      </html>
    </ClerkProvider>
  );
}