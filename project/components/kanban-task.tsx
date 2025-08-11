"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DateTimeFormatter } from "@/lib/utils";
import { Task } from "@/lib/db/schema";

export function KanbanTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    cursor: "grab",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border rounded-lg cursor-pointer dark:bg-outer_space-300 border-french_gray-300 dark:border-gray-400 hover:shadow-md"
    >
      <h4 className="mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
        {DateTimeFormatter(task.dueDate)}
      </h4>
      <p className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mb-3">
        {task.title}
      </p>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue_munsell-100 text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300">
          {task.label}
        </span>
        <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white rounded-full bg-blue_munsell-500">
          U
        </div>
      </div>
    </div>
  );
}