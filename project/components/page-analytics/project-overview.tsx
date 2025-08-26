"use client";
import { Calendar } from "lucide-react"
import { DateTimeFormatter, ComputeProgress } from "@/lib/utils"
import { UserProjects } from "@/lib/customtype"

export function ProjectOverview({ project } : { project?: UserProjects | null }){
  // Get data to display
  const name = project?.name ?? "N/A";
  const dueDate = project?.dueDate ? DateTimeFormatter(project.dueDate) : "N/A";
  const columnCount = project?.columnCount ?? 0;
  const members = project?.members ?? [];
  const tasks = project?.tasks ?? [];
  const approvedMembers = members.filter((m) => m.approved).length;
  const pendingMembers = members.length - approvedMembers;
  const progress = project ? ComputeProgress(tasks, columnCount) : 0;

  return(
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Project Overview
        </h3>
        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
            Project Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Name:</span>
              <span className="text-gray-900 dark:text-white">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
              <span className="text-gray-900 dark:text-white">{dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Columns:</span>
              <span className="text-gray-900 dark:text-white">{columnCount}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Team Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Members:</span>
              <span className="text-gray-900 dark:text-white">{members.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Approved:</span>
              <span className="text-gray-900 dark:text-white">{approvedMembers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pending:</span>
              <span className="text-gray-900 dark:text-white">{pendingMembers}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Progress</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completion</span>
                <span className="text-gray-900 dark:text-white">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}