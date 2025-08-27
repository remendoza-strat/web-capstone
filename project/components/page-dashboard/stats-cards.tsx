import React from "react"
import { BarChart3, AlertTriangle, CheckSquare, FolderOpen } from "lucide-react"
import { UserProjects } from "@/lib/customtype"

export function StatsCards({ userId, userProjs } : { userId: string, userProjs: UserProjects[] }){
  // Projects that user is approved
  const approved = userProjs.filter((p) => p.members.some((m) => m.userId === userId && m.approved));

  // Projects Stats
  const allProjs = approved.length;
  const compProjs = approved.filter((p) =>
    p.tasks.length > 0 &&
    p.tasks.every((t) => t.position === p.columnCount - 1)).length;
  const activeProjs = (approved.filter((p) => 
    p.dueDate > new Date() && 
    (p.tasks.length === 0 || p.tasks.some((t) => t.position < p.columnCount - 1)))).length;
  const overdueProjs = (approved.filter((p) => 
    p.dueDate < new Date() &&
    (p.tasks.length === 0 || p.tasks.some((t) => t.position < p.columnCount - 1)))).length;

  // Card data
  const statsData = [
    {
      title: "All Projects",
      value: allProjs,
      icon: FolderOpen, 
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Completed Projects",
      value: compProjs,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Active Projects",
      value: activeProjs,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      title: "Overdue Projects",
      value: overdueProjs,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    }
  ];

  return(
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="p-6 transition-all duration-200 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}