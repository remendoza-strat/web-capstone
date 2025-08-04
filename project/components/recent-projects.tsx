import "./globals.css"
import Link from "next/link"
import { Users, Calendar, Clipboard } from "lucide-react"
import { DateTimeFormatter, LimitChar } from "@/lib/utils"
import { UserProjects } from "@/lib/customtype"

export function RecentProjects({ userProjs } : { userProjs: UserProjects[] }){
  // Progress calculator
  const computeProgress = (position: number, columnCount: number) => {
    if (position === 100) return 100;
    return Math.round((position / columnCount) * 100);
  }

  // Sort by most recent updated date
  const recent = [...userProjs].sort((a, b) =>
    new Date(b.updatedAt?? 0).getTime() - new Date(a.updatedAt?? 0).getTime()
  );

  // Get all needed data from three recent projects
  const projects = recent.slice(0, 3).map((proj) => {
    // Get member and task count of project
    const memberCount = proj.members.length;
    const taskCount = proj.tasks.length;

    // Get total value of tasks
    const total = proj.tasks.reduce((acc, task) => {
      return acc + computeProgress(task.position, task.columnCount);
    }, 0);

    // Average the task
    const progress = taskCount > 0 ? Math.round(total / taskCount): 0;

    // Return data
    return{
      ...proj, memberCount, taskCount, progress
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
                <h4 className="py-1 page-main-title">
                  {project.name}
                </h4>
                <p className="py-1 page-sub-text">
                  {LimitChar(project.description, 120)}
                </p>
                <div className="flex items-center py-1 space-x-4 page-gray-text">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1"/>
                    {DateTimeFormatter(project.dueDate)}
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