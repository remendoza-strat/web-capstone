import React from "react"
import { BarChart3, AlertTriangle, CheckSquare, Clock } from "lucide-react"
import { UserProjects } from "@/lib/customtype"

export function StatsCards({ userProjs } : { userProjs: UserProjects[] }){
    // Active and overdue project computation
  const activeProjs = (userProjs.filter((p) => 
    p.dueDate > new Date() && 
    p.tasks.some((t) => t.position < (p.columnCount - 1)))).length;
  const overdueProjs = (userProjs.filter((p) => 
    p.dueDate < new Date() &&
    p.tasks.some((t) => t.position < (p.columnCount - 1)))).length;

  // Active and overdue task computation
  const activeTasks = userProjs.flatMap(p => p.tasks.filter (t =>
    t.dueDate > new Date() && t.position < (p.columnCount - 1))).length;
  const overdueTasks = userProjs.flatMap(p => p.tasks.filter (t =>
    t.dueDate < new Date() && t.position < (p.columnCount - 1))).length;

  // Card data
  const statsData = [
    {
      title: "Active Projects",
      value: activeProjs,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Overdue Projects",
      value: overdueProjs,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    },
    {
      title: "Active Tasks",
      value: activeTasks,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  return(
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="p-6 transition-all duration-200 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg"
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