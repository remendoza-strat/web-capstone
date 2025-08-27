import React from "react"
import { Plus, Users, CheckSquare } from "lucide-react"
import { useModal } from "@/lib/states"

export function QuickActions(){
  // Opening modal
  const { openModal } = useModal();

  return(
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => openModal("createProject")}
          className="flex items-center w-full px-4 py-3 space-x-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          <Plus className="w-5 h-5"/>
          <span>Create New Project</span>
        </button>
        <button
          type="button"
          onClick={() => openModal("createMember")}
          className="flex items-center w-full px-4 py-3 space-x-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
        >
          <Users className="w-5 h-5"/>
          <span>Add Team Member</span>
        </button>
        <button
          type="button"
          onClick={() => openModal("createTask")}
          className="flex items-center w-full px-4 py-3 space-x-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
        >
          <CheckSquare className="w-5 h-5"/>
          <span>Create New Task</span>
        </button>
      </div>
    </div>
  );
}