"use client"
import { ArrowLeft, Users, Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import UpdateProject from "@/components/projects-modal/update";
import {DeleteProject} from "@/components/projects-modal/delete";
import { useModal } from "@/lib/states";
import { Role, UserProjects } from "@/lib/customtype";
import { hasPermission } from "@/lib/permissions";


export default function ProjectMainPage({userId, projectData} : {userId: string, projectData: UserProjects}){
  const role: Role = projectData.members.find((m) => m.userId === userId)?.role as Role;
  
  const display = (hasPermission(role, "editProject"));

  
	const { isOpen, modalType, openModal } = useModal();
	
	return(
		<DashboardLayout>
      {display && isOpen && modalType === "updateProject" && <UpdateProject />}
      {display &&isOpen && modalType === "deleteProject" && <DeleteProject projectId={projectData.id}/>}

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
              <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
                {projectData.name}
              </h1>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                {projectData.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
              aria-label="More options"
            >
              <Calendar size={20} />
            </button>
            <button
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Users size={20} />
            </button>
            <button
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
              onClick={() => openModal("updateProject")}
              aria-label="Update Project"
            >
              <Pencil size={20} />
            </button>
            <button
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
              onClick={() => openModal("deleteProject")}
              aria-label="Delete Project"
            >
              <Trash2 size={20} />
            </button>            
          </div>
        </div>

        {/* Kanban Board Placeholder */}
        <div className="p-6 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:gray-400">
          <div className="flex pb-4 space-x-6 overflow-x-auto">
            {(["backlog", "this week", "in progress", "to review", "done"]).map((columnTitle) => (
              <div key={columnTitle} className="flex-shrink-0 w-80">
                <div className="border rounded-lg bg-platinum-800 dark:bg-outer_space-400 border-french_gray-300 dark:gray-400">
                  <div className="p-4 border-b border-french_gray-300 dark:gray-400">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">
                        {columnTitle}
                        <span className="px-2 py-1 ml-2 text-xs bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full">
                          hi
                        </span>
                      </h3>
                      <button className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 min-h-[400px]">
                    {["task 1"].map((task) => (
                      <div
                        key={task}
                        className="p-4 transition-shadow bg-white border rounded-lg cursor-pointer dark:bg-outer_space-300 border-french_gray-300 dark:gray-400 hover:shadow-md"
                      >
                        <h4 className="mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                          {task}
                        </h4>
                        <p className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mb-3">
                          {task}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue_munsell-100 text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300">
                            {task}
                          </span>
                          <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white rounded-full bg-blue_munsell-500">
                            U
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="w-full p-3 border-2 border-dashed rounded-lg border-french_gray-300 dark:gray-400 text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
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
	);
}