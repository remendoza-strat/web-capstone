"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Theme types
type Theme = "dark" | "light";

// Props for theme provider
type ThemeProviderProps = {
  children: React.ReactNode
}
type ThemeProviderState = {
  theme: Theme,
  setTheme: (theme: Theme) => void
}

// Initial themme
const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null
}

// Context with initial state
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps){
  // State for theme
  const [theme, setTheme] = useState<Theme>("light");

  // Load theme from storage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if(savedTheme){
      setTheme(savedTheme);
    }
  }, [])

  // Update page theme and save in local storage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Updater function
  const value = {
    theme,
    setTheme
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

// Hook for theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}