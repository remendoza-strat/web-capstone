"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle(){
  // Use theme provider
  const { theme, setTheme } = useTheme();

  return(
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 transition-colors bg-white border border-gray-300 shadow-sm rounded-xl hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
      ) : (
        <Sun className="w-5 h-5 text-yellow-500"/>
      )}
    </button>
  );
}