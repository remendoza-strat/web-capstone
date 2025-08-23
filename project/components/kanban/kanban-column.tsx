"use client"
import { useState } from "react"
import { Edit2, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanTask } from "@/components/kanban/kanban-task"
import { TaskWithAssignees } from "@/lib/customtype"

export function KanbanColumn
  ({ id, title, tasks, userId, editProject, onUpdateColumn, onDeleteColumn, onCreateTask } : 
  { id: string; title: string; tasks: TaskWithAssignees[]; userId: string; editProject: boolean; onUpdateColumn: () => void; onDeleteColumn: () => void; onCreateTask: () => void; }){
  
  // Making div a drop target
  const { setNodeRef } = useDroppable({ id });

  // Show menu in column
  const [showMenu, setShowMenu] = useState(false);

  return(
    <div
      ref={setNodeRef}
      className="flex flex-col flex-shrink-0 max-h-full p-4 bg-gray-100/70 w-80 dark:bg-gray-900 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {tasks.length}
          </span>
        </div>
        {editProject && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
            </button>
            {showMenu && (
              <div className="absolute right-0 z-10 w-48 mt-1 bg-white border border-gray-200 shadow-lg top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-700 transition-colors dark:text-gray-300 rounded-t-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit2 className="inline w-4 h-4 mr-2"/>
                  Edit Column
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-600 transition-colors rounded-b-xl dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-xl"
                >
                  <Trash2 className="inline w-4 h-4 mr-2"/>
                  Delete Column
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {tasks.map((task) => (
            <KanbanTask key={task.id} task={task} userId={userId} editProject={editProject}/>
          ))}
          {editProject && (
            <button
              type="button"
              className="w-full p-3 mt-3 text-gray-500 transition-colors border-2 border-gray-300 border-dashed dark:text-gray-400 dark:border-gray-600 rounded-xl hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400"
            >
              <Plus className="w-5 h-5 mx-auto mb-1"/>
              <span className="text-sm">Add Task</span>
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  );
}