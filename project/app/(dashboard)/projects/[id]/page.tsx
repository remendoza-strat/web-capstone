import { ArrowLeft, Settings, Users, Calendar, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ProjectPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/projects"
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Project: </h1>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                Kanban board view for project management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Users size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Calendar size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Implementation Tasks Banner */}
        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <h3 className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
            🎯 Kanban Board Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Task 5.1: Design responsive Kanban board layout</li>
            <li>• Task 5.2: Implement drag-and-drop functionality with dnd-kit</li>
            <li>• Task 5.4: Implement optimistic UI updates for smooth interactions</li>
            <li>• Task 5.6: Create task detail modals and editing interfaces</li>
          </ul>
        </div>

        {/* Kanban Board Placeholder */}
        <div className="bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6">
          <div className="flex pb-4 space-x-6 overflow-x-auto">
            {["To Do", "In Progress", "Review", "Done"].map((columnTitle, columnIndex) => (
              <div key={columnTitle} className="flex-shrink-0 w-80">
                <div className="border rounded-lg bg-platinum-800 dark:bg-outer_space-400 border-french_gray-300 dark:border-payne's_gray-400">
                  <div className="p-4 border-b border-french_gray-300 dark:border-payne's_gray-400">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">
                        {columnTitle}
                        <span className="px-2 py-1 ml-2 text-xs bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full">
                          {Math.floor(Math.random() * 5) + 1}
                        </span>
                      </h3>
                      <button className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 min-h-[400px]">
                    {[1, 2, 3].map((taskIndex) => (
                      <div
                        key={taskIndex}
                        className="p-4 bg-white border rounded-lg dark:bg-outer_space-300 border-french_gray-300 dark:border-payne's_gray-400 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <h4 className="mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                          Sample Task {taskIndex}
                        </h4>
                        <p className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mb-3">
                          This is a placeholder task description
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue_munsell-100 text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300">
                            Medium
                          </span>
                          <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white rounded-full bg-blue_munsell-500">
                            U
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="w-full p-3 border-2 border-dashed border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
                      + Add task
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Component Implementation Guide */}
        <div className="p-6 mt-8 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600">
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            🛠️ Components & Features to Implement
          </h3>
          <div className="grid grid-cols-1 gap-6 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-400">
            <div>
              <strong className="block mb-2">Core Components:</strong>
              <ul className="space-y-1 list-disc list-inside">
                <li>components/kanban-board.tsx</li>
                <li>components/task-card.tsx</li>
                <li>components/modals/create-task-modal.tsx</li>
                <li>stores/board-store.ts (Zustand)</li>
              </ul>
            </div>
            <div>
              <strong className="block mb-2">Advanced Features:</strong>
              <ul className="space-y-1 list-disc list-inside">
                <li>Drag & drop with @dnd-kit/core</li>
                <li>Real-time updates</li>
                <li>Task assignments & due dates</li>
                <li>Comments & activity history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
