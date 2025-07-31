import Link from "next/link"
import { MoreHorizontal, Users, Calendar } from "lucide-react"
import { DateTimeFormatter, LimitChar } from "@/lib/utils"
import { UserRecentProject } from "@/lib/customtype"

export function RecentProjects({recentProj}: {recentProj: UserRecentProject[]}) {
  return (
    <div className="bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="p-6 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">Recent Projects</h3>
        <Link href="/projects" className="p-6 text-sm font-medium text-blue_munsell-500 hover:text-blue_munsell-600">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {recentProj.slice(0, 3).map((project) => (
          <div key={project.project.id} className="p-3 border-t border-b page-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-outer_space-500 dark:text-platinum-500">{project.project.name}</h4>
                <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mt-1 overflow-hidden">{LimitChar(project.project.description, 120)}</p>

                <div className="flex items-center mt-3 space-x-4 text-sm text-payne's_gray-500 dark:text-french_gray-400">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {DateTimeFormatter(project.project.dueDate)}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {project.memberCount < 2 ? 
                      (<p>{project.memberCount} Member</p>) : (<p>{project.memberCount} Members</p>)
                    }
                  </div>
                  </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-payne's_gray-500 dark:text-french_gray-400">Progress</span>
                    <span className="text-outer_space-500 dark:text-platinum-500">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-2">
                    <div
                      className="h-2 transition-all duration-300 rounded-full bg-blue_munsell-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
