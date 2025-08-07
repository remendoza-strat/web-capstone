"use client"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header(){
  return(
    <header className="border-b page-card">
      <div className="px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="page-logo">
              ProjectFlow
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle/>
            <Link href="/sign-in" className="px-4 py-2 page-generic-btn">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}