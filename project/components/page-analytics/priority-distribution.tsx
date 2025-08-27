"use client";
import { PieChart as PieChartIcon } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Task } from "@/lib/db/schema"

export function PriorityDistribution({ tasks } : { tasks?: Task[] | null }){
  // Get count per priority
  const allTasks = tasks ?? [];
  const highCount = allTasks.filter((t) => t.priority === "High").length;
  const medCount = allTasks.filter((t) => t.priority === "Medium").length;
  const lowCount = allTasks.filter((t) => t.priority === "Low").length;

  // Setup data
  const data = allTasks.length > 0? 
        [
          { name: "High Priority", value: highCount, color: "#dc2626" },
          { name: "Medium Priority", value: medCount, color: "#ea580c" },
          { name: "Low Priority", value: lowCount, color: "#f59e0b" }
        ]
      : [{ name: "No Tasks", value: 1, color: "#9ca3af" }];

  return(
    <div className="flex flex-col h-full p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Priority Distribution
        </h3>
        <PieChartIcon className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center justify-center h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}/>
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  border: "none"
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          {allTasks.length > 0
            ? data.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.value}
                  </span>
                </div>
              ))
            : (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                No tasks to display
              </p>
            )}
        </div>
      </div>
      <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
          <span className="font-medium text-gray-900 dark:text-white">{allTasks.length}</span>
        </div>
      </div>
    </div>
  );
}