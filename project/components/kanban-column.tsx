"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanTask } from "./kanban-task";
import { Task } from "@/lib/db/schema";

export function KanbanColumn({ id, title, tasks }: {id: string; title: string; tasks: Task[];}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 p-4 rounded-lg border ${
        isOver ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-50 dark:bg-outer_space-400"
      }`}
    >
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

          {/* Add Task button at the end */}
          <button className="w-full p-3 border-2 border-dashed rounded-lg border-french_gray-300 dark:border-gray-400 text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
            + Add Task
          </button>
        </div>
      </SortableContext>
    </div>
  );
}
