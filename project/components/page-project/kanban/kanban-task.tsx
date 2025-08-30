"use client"
import Link from "next/link"
import { GripVertical, Calendar, Flag, Tag, Lock } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DateTimeFormatter, LimitChar } from "@/lib/utils"
import { TaskWithAssignees } from "@/lib/customtype"
import { UserAvatar } from "@/components/user-avatar"
import { StripHTML } from "@/lib/utils"

export function KanbanTask({ task, userId, editTask } : { task: TaskWithAssignees; userId: string; editTask: boolean; }){
  // Check if user is allowed to drag the task
  const assignee = task.assignees?.some((a) => a.userId === userId);
  const isAllowed = assignee || editTask;

  // Enable drag and drop
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } 
  = useSortable({ id: task.id, data: { task }, disabled: !isAllowed });

  // Apply movement and transition
  const style = { transform: CSS.Transform.toString(transform), transition };

  // Get color of priority
  function PriorityColor(priority: string){
    if (priority === "High") return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
    if (priority === "Medium") return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400";
    if (priority === "Low") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
  };

  return(
    <Link
      href={`/task/${task.id}`}
      ref={setNodeRef}
      style={style}
      className={`block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md
        ${isDragging ? "shadow-lg rotate-2 opacity-30" : ""}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
            {task.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {LimitChar(StripHTML(task.description), 70)}
          </p>
        </div>
        <div
          {...(isAllowed ? { ...attributes, ...listeners } : {})}
          onClick={(e) => e.preventDefault()}
          className={`p-1 ml-2 rounded transition-colors ${isAllowed ? 
            "cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700"
            : "cursor-not-allowed text-gray-400"
          }`}
        >
          {isAllowed ? 
            (
              <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500"/>
            ) : 
            (
              <Lock className="w-4 h-4"/>
            )
          }
        </div>
      </div>
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="flex items-center px-2 py-1 space-x-1 font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
          <Tag className="w-3 h-3"/>
          <span>{task.label}</span>
        </span>
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full ${PriorityColor(task.priority)}`}
        >
          <Flag className="w-3 h-3"/>
          <span className="font-medium capitalize">{task.priority}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="w-3 h-3"/>
        <span>{DateTimeFormatter(task.dueDate)}</span>
      </div>
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex mt-2 -space-x-2">
          {task.assignees.slice(0, 5).map((assignee) => (
            <UserAvatar key={assignee.id} clerkId={assignee.user.clerkId}/>
          ))}
          {task.assignees.length > 5 && (
            <div className="flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-700 bg-gray-300 border-2 border-white rounded-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-900">
              +{task.assignees.length - 5}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}