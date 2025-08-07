import "./globals.css"
import Link from "next/link"
import { Users, Calendar, Clipboard } from "lucide-react"
import { ComputeProgress, DateTimeFormatter, LimitChar } from "@/lib/utils"
import { UserProjects } from "@/lib/customtype"
import { ByRecentProjects } from "@/lib/utils"

export function RecentProjects({ userProjs } : { userProjs: UserProjects[] }){
  // Sort by most recent updated date
  const recent = ByRecentProjects(userProjs);

  // Get important data per project
  const projects = recent.slice(0, 3).map((project) => {
    const memberCount = project.members.length;
    const taskCount = project.tasks.length;
    const briefDesc = LimitChar(project.description, 75);
    const detailedDate = DateTimeFormatter(project.dueDate);
    const progress = ComputeProgress(project.tasks);
    return{
      ...project, memberCount, taskCount, progress, briefDesc, detailedDate
    };
  })

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
        {projects.map((project) => (
          <div key={project.id} className="px-3 border-t page-card">
            <div className="flex items-start justify-between">
              <div className="flex-1 p-4">
                <h4 className="py-1 page-main-title page-dark-light-text">
                  {project.name}
                </h4>
                <p className="py-1 page-dark-light-text">
                  {project.briefDesc}
                </p>
                <div className="flex items-center py-1 space-x-4 page-gray-text">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1"/>
                    {project.detailedDate}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1"/>
                    {project.memberCount}
                  </div>
                  <div className="flex items-center">
                    <Clipboard size={16} className="mr-1"/>
                    {project.taskCount}
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