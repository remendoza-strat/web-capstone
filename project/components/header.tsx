"use client";
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-gray-300 bg-platinum-100 dark:bg-black_shades-200">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-blue_munsell-400 hover:text-blue_munsell-600"
            >
              ProjectFlow
            </Link>
          </div>

          <nav className="hidden space-x-8 md:flex">
            <Link
              href="#features"
              className="text-md text-black_shades-100 dark:text-platinum-300 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-md text-black_shades-100 dark:text-platinum-300 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-md text-black_shades-100 dark:text-platinum-300 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 text-gray-500 bg-platinum-500"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20}/>}
            </button>

            <Link
              href="/sign-in"
              className="px-4 py-2 text-white bg-blue_munsell-400 hover:bg-blue_munsell-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}