"use client"
import Link from "next/link"
import { List, Flag, Tag, Calendar, BarChart3, FolderOpen, AlertTriangle, CheckCircle } from "lucide-react"
import { DateTimeFormatter, LimitChar, StripHTML } from "@/lib/utils"
import { UserTask } from "@/lib/customtype"

export function UpcomingTasks({ tasks } : { tasks: UserTask[] }){

  // Get color of priority
  function PriorityColor(priority: string){
    if (priority === "High") return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
    if (priority === "Medium") return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400";
    if (priority === "Low") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
  };

  // Get data of each task
  const taskData = tasks.filter((t) => t.task.position < t.task.project.columnCount - 1)
    .map((t) => {
      const id = t.task.id;
      const label = t.task.label;
      const priority = t.task.priority;
      const title = t.task.title;
      const description = LimitChar(StripHTML(t.task.description), 120);
      const deadline = DateTimeFormatter(t.task.dueDate);
      const name = t.task.project.name;
      const progress = Math.round((t.task.position / t.task.project.columnCount) * 100);
      const status = new Date(t.task.dueDate) < new Date()? "Overdue" : "Active";
      const duedate = t.task.dueDate;
      return { 
        id, label, priority, title, description, deadline, name, progress, status, duedate 
      };
    }
  ).sort((a, b) => new Date(a.duedate).getTime() - new Date(b.duedate).getTime());

 return(
    <div className="flex flex-col h-full p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <List className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upcoming Tasks
          </h2>
        </div>
      </div>
      <div className="flex-1 pr-2 space-y-4 overflow-y-auto">
        {taskData.map((task) => (
					<Link href={`task/${task.id}`} key={task.id}>
            <div className="p-5 m-2 transition-colors border border-gray-200 rounded-xl dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-end gap-2 mb-2 text-xs">
                  <span className="flex items-center px-2 py-1 space-x-1 font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
                    <Tag className="w-3 h-3"/>
                    <span>{task.label}</span>
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full font-medium ${PriorityColor(task.priority)}`}>
                    <Flag className="w-3 h-3"/>
                    <span>{task.priority}</span>
                  </div>
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full font-medium
                        ${task.status === "Overdue"
                          ? "text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                          : "text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400"}`}
                    >
                      {task.status === "Overdue" ? (
                        <>
                          <AlertTriangle className="w-3 h-3"/>
                          <span>{task.status}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3"/>
                          <span>{task.status}</span>
                        </>
                      )}
                    </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 truncate dark:text-white">
                  {task.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  {task.description}
                </p>
                <div className="flex items-center my-2 space-x-1 text-xs text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-purple-500"/>
                  <span>{task.deadline}</span>
                </div>
                <div className="flex items-center my-2 space-x-1 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-1">
                    <FolderOpen className="w-4 h-4 text-green-500"/>
                    <span className="font-medium">{task.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4 text-indigo-500"/>
                    <span>{task.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
						</Link>
          ))}
      </div>
    </div>
  );
}