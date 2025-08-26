"use client"
import { TrendingUp, TrendingDown, Activity, AlertTriangle, LibraryBig } from "lucide-react"
import { UserProjects } from "@/lib/customtype"
import { TaskTrack } from "@/lib/utils"

export function ProjectStats({ project } : { project?: UserProjects | null }){
  // Get data
  const tasks = project?.tasks ?? [];
  const columns = project?.columnCount?? 0;
  const done = columns - 1;

  // Total task tracking
  const { diff: trackValue, text: trackText } = TaskTrack(tasks);

  // Completed card data
  const completedTasks = tasks.filter((t) => t.position === done).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Overdue tasks card data
  const overdueTasks = tasks.filter(
    (t) => new Date() > new Date(t.dueDate) && t.position !== done
  ).length;

  // Active tasks card data
  const activeTasks = tasks.filter(
    (t) => new Date() <= new Date(t.dueDate) && t.position !== done
  ).length;

  return(
    <div className="flex flex-col h-full p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Task Stats
        </h3>
        <LibraryBig className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
      </div>
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-6">
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {tasks.length}
            </p>
          </div>
          <div className="flex items-center text-sm">
            {trackValue >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1 text-green-500"/>
            ) : (
              <TrendingDown className="w-4 h-4 mr-1 text-red-500"/>
            )}
            <span
              className={
                trackValue >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {trackText} from last month
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {completedTasks}
            </p>
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            {completionRate}% completion
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              In Progress
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeTasks}
            </p>
          </div>
          <div className="flex items-center text-sm">
            <Activity className="w-4 h-4 mr-1 text-blue-500"/>
            <span className="text-blue-600 dark:text-blue-400">
              Active development
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Overdue
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {overdueTasks}
            </p>
          </div>
          <div className="flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 mr-1 text-red-500"/>
            <span className="text-red-600 dark:text-red-400">
              Needs attention
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}