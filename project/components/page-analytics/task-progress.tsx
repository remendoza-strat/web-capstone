"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp } from "lucide-react"
import { UserProjects } from "@/lib/customtype"

export function TaskProgress({ project } : { project?: UserProjects | null }){
  // Get data
  const cols = project?.columnNames ?? [];
  const tasks = project?.tasks ?? [];

  // Count tasks per column
  const completionTrend =
    cols.length > 0
      ? cols.map((colName, index) => {
          const taskCount = tasks.filter((t) => t.position === index).length;
          return { status: colName, tasks: taskCount };
        })
      : Array.from({ length: 3 }, (_, i) => ({ status: `Column ${i + 1}`, tasks: 0 }));

  // Bar colors
  const barColors = ["#6366f1", "#f472b6", "#10b981"];

  return(
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Task Progress
        </h3>
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={completionTrend}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="status"
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "0.5rem",
                border: "none",
                color: "#fff",
              }}
            />
            <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
              {completionTrend.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}