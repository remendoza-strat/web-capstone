"use client"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function Header(){
  return(
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl dark:text-white"
          >
            ProjectFlow
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle/>
            <Link
              href="/sign-in"
              className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base font-medium text-white transition-colors bg-blue-600 shadow-sm rounded-xl hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}