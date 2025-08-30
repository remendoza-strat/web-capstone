"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FolderOpen, Users, Menu, X, BarChart3, Calendar } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import ThemeToggle from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"

// Links of nav bar
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Team", href: "/team", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar }
];

export default function DashboardLayout({ children } : { children: React.ReactNode }){
  // Get current user
  const { user } = useUser();
  
  // Track side bar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current path
  const pathname = usePathname(); 

  return(
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ProjectFlow
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 transition-colors rounded-xl lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>
        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return(
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 w-5 h-5 ${
                        isActive ? "text-blue-600 dark:text-blue-400" : ""
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/profile"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              pathname.startsWith("/profile")
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <div className="mr-2">
              {user?.id ? (<UserAvatar clerkId={user.id}/>) : (<Users className="w-5 h-5 mr-3"/>) }
            </div>
            <span>{user?.id ? (<p>{user.firstName} {user.lastName}</p>) : (<p> </p>) }</span>
          </Link>
        </div>
      </div>
      </div>
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 transition-colors rounded-xl lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            <Menu className="w-5 h-5"/>
          </button>
          <div className="flex justify-end flex-1">
            <div className="flex items-center space-x-4">
              <ThemeToggle/>
            </div>
          </div>
        </div>
        <main className="min-h-screen px-6 py-6 transition-colors bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}