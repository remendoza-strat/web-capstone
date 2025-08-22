"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanTask } from "./kanban-task";
import { Task } from "@/lib/db/schema";
import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/lib/states";

export function KanbanColumn({ editProject, id, title, tasks, onUpdateColumn, onDeleteColumn, onCreateTask } :
   { editProject: boolean; id: string; title: string; tasks: Task[]; onUpdateColumn: () => void;  onDeleteColumn: () => void; onCreateTask: () => void;}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  const { isOpen, modalType, openModal } = useModal();

  return (
    <div>
      
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 p-4 rounded-lg border ${
        isOver ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-50 dark:bg-outer_space-400"
      }`}
    >

      {editProject && (
        <>
          <button
            className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
            onClick={() => {openModal("updateColumn"); onUpdateColumn()}}>
            <Pencil size={15}/>
          </button>

          <button
            className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
            onClick={() => {openModal("deleteColumn"); onDeleteColumn()}}>
              <Trash2 size={15}/>
          </button>
        </>
      )}
            
      <h3 className="mb-4 font-semibold text-outer_space-500 dark:text-platinum-500">
        {title} <span className="text-sm text-gray-500">({tasks.length})</span>
      </h3>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[400px]">
          {tasks.map((task) => (
            <KanbanTask key={task.id} task={task} />
          ))}

          {editProject && 
            <button 
              className="w-full p-3 border-2 border-dashed rounded-lg border-french_gray-300 dark:border-gray-400 text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors"
              onClick={() => {openModal("createTask"); onCreateTask()}}>
                + Add Task
            </button>
          }
        </div>
      </SortableContext>
    </div>
    </div>
  );
}
