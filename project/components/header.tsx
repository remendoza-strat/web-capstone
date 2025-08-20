"use client"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header(){
  return(
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              ProjectFlow
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle/>
            <Link
              href="/sign-in"
              className="px-5 py-2 font-medium text-white transition-colors bg-blue-600 shadow-sm rounded-xl hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}