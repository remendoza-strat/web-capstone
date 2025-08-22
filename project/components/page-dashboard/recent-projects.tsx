import React from "react"
import Link from "next/link"
import { Calendar, Users, CheckSquare } from "lucide-react"
import { UserProjects } from "@/lib/customtype"
import { ByRecentProjects, ComputeProgress, DateTimeFormatter, LimitChar, ProgressColor } from "@/lib/utils"

export function RecentProjects({ userId, userProjs } : { userId: string, userProjs: UserProjects[] }){
  // Projects that user is approved
  const approved = userProjs.filter((p) => p.members.some((m) => m.userId === userId && m.approved));
  
  // Sort by most recent updated date
	const recent = ByRecentProjects(approved);

	// Get important data per project
  const projects = recent.slice(0, 3).map((project) => {
    const memberCount = (project.members.filter((m) => m.approved)).length;
    const taskCount = project.tasks.length;
    const briefDesc = LimitChar(project.description, 75);
    const detailedDate = DateTimeFormatter(project.dueDate);
    const progress = ComputeProgress(project.tasks, project.columnCount);
    const progColor = ProgressColor(progress);
    return{
        ...project, memberCount, taskCount, briefDesc, detailedDate, progress, progColor
    };
	});

  return(
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
        <Link href="/projects" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View all</Link>
      </div>
      <div className="pr-2 space-y-4">
        {projects?.map((project) => (
          <Link href={`projects/${project.id}`} key={project.id}>
            <div className="p-5 my-2 transition-colors border border-gray-200 rounded-xl dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{project.briefDesc}</p>
                </div>
              </div>
              <div className="flex items-center mb-3 space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4"/>
                  <span>{project.detailedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4"/>
                  <span>{project.memberCount} {project.memberCount > 1 ? "members" : "member"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckSquare className="w-4 h-4"/>
                  <span>{project.taskCount} {project.taskCount > 1 ? "tasks" : "task"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${project.progColor}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}