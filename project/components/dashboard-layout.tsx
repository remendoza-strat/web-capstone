"use client"
import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { Home, FolderOpen, Users, Settings, Moon, Sun, Menu, X, BarChart3, Calendar } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { UserButton } from "@clerk/nextjs"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Team", href: "/team", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings }
];

export function DashboardLayout({ children } : { children: React.ReactNode }){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname(); 

  return(
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ProjectFlow
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 transition-colors rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>
        <nav className="px-4 mt-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return(
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className={`mr-3 w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}/>
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 transition-colors rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            <Menu className="w-5 h-5"/>
          </button>
          <div className="flex justify-end flex-1">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 transition-colors bg-white rounded-lg dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500"/>
                )}
              </button>
              <UserButton/>
            </div>
          </div>
        </div>
        <main className="min-h-screen px-4 py-5 transition-colors bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}