import "./globals.css"
import Link from "next/link"
import { Users, Calendar } from "lucide-react"
import { DateTimeFormatter, LimitChar } from "@/lib/utils"
import { UserRecentProject } from "@/lib/customtype"

export function RecentProjects({recentProj} : { recentProj: UserRecentProject[] }){
  return(
    <div className="border page-card">
      <div className="flex items-center justify-between p-5">
        <h3 className="page-section-main">
          Recent Projects
        </h3>
        <Link href="/projects" className="page-section-sub">
          View all
        </Link>
      </div>
      <div>
        {recentProj.slice(0, 3).map((project) => (
          <div key={project.project.id} className="px-3 border-t page-card">
            <div className="flex items-start justify-between">
              <div className="flex-1 p-4">
                <h4 className="py-1 page-main-title">
                  {project.project.name}
                </h4>
                <p className="py-1 page-sub-text">
                  {LimitChar(project.project.description, 120)}
                </p>
                <div className="flex items-center py-1 space-x-4 page-gray-text">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1"/>
                    {DateTimeFormatter(project.project.dueDate)}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1"/>
                    {project.memberCount}
                  </div>
                 </div>
                <div className="py-2">
                  <div className="flex items-center justify-between page-progress-text">
                    <span className="py-1">
                      Progress
                    </span>
                    <span>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="page-progress-div">
                    <div
                      className="page-progress-bar"
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
  );
}