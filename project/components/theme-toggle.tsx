"use client"
import "./globals.css"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle(){
  const { theme, setTheme } = useTheme()

  return(
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="page-theme-button"
    >
      {theme === "light" ? <Moon size={20}/> : <Sun size={20}/>}
    </button>
  );
}