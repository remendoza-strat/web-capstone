"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DateTimeFormatter } from "@/lib/utils";
import { Task } from "@/lib/db/schema";
import { GripVertical } from "lucide-react";

export function KanbanTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    console.log(task.id + " " + task.title);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 p-4 bg-white border rounded-lg dark:bg-outer_space-300 border-french_gray-300 dark:border-gray-400 hover:shadow-md"
    >
      <div className="flex items-end justify-end">
        
        <span
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </span>
      </div>
      
      <div onClick={handleClick} className="cursor-pointer">
        <h4 className="text-sm font-medium text-outer_space-500 dark:text-platinum-500">
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
    </div>
  );
}