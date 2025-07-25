import { UserPlus, Mail, MoreHorizontal } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Team</h1>
            <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">Manage team members and permissions</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-blue_munsell-500 hover:bg-blue_munsell-600">
            <UserPlus size={20} className="mr-2" />
            Invite Member
          </button>
        </div>

        {/* Implementation Tasks Banner */}
        <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            📋 Team Management Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>• Task 6.1: Implement task assignment and user collaboration features</li>
            <li>• Task 6.4: Implement project member management and permissions</li>
          </ul>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "John Doe", role: "Project Manager", email: "john@example.com", avatar: "JD" },
            { name: "Jane Smith", role: "Developer", email: "jane@example.com", avatar: "JS" },
            { name: "Mike Johnson", role: "Designer", email: "mike@example.com", avatar: "MJ" },
            { name: "Sarah Wilson", role: "Developer", email: "sarah@example.com", avatar: "SW" },
            { name: "Tom Brown", role: "QA Engineer", email: "tom@example.com", avatar: "TB" },
            { name: "Lisa Davis", role: "Designer", email: "lisa@example.com", avatar: "LD" },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full bg-blue_munsell-500">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">{member.name}</h3>
                    <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">{member.role}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex items-center text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
                <Mail size={16} className="mr-2" />
                {member.email}
              </div>

              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                  Active
                </span>
                <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                  {Math.floor(Math.random() * 10) + 1} projects
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
