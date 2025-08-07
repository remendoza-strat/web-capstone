import "./globals.css"
import Link from "next/link"
import { UserProjects } from "@/lib/customtype"
import { ComputeProgress, DateTimeFormatter, ProjectStatus, LimitChar, ByRecentProjects } from "@/lib/utils"
import { Calendar, Users, SquareCheckBig, Clock, ListCheck } from "lucide-react"

export function ProjectGrid({ filteredProjs } : { filteredProjs: UserProjects[] }){
  // Sort by most recent updated date
  const recent = ByRecentProjects(filteredProjs);

  // Get important data per project
  const projects = recent.map((project) => {
    const [projLabel, projStatus] = ProjectStatus(project.tasks, project.dueDate);
    const briefDesc = LimitChar(project.description, 70);
    const memberCount = (project.members.length);
    const taskDone = (project.tasks.filter((t) => t.position === 100)).length;
    const taskCount = project.tasks.length;
    const detailedDate = DateTimeFormatter(project.dueDate);
    const progress = ComputeProgress(project.tasks);
    return{
      ...project, projLabel, projStatus, briefDesc, memberCount, 
      taskDone, taskCount, detailedDate, progress
    };
  });

  return(
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link href={`projects/${project.id}`} key={project.id}>
          <div className="p-5 border page-card page-project-hover">
            <div className="flex justify-end">
              <div className={`flex p-1 items-center 
                ${project.projLabel === "overdue" ? "page-tag-overdue page-sm-md-text" : 
                  project.projLabel === "active" ? "page-tag-active page-sm-md-text" : "page-tag-done page-sm-md-text"
                }`}>
                {project.projLabel === "done" ? 
                  <><ListCheck size={16} className="m-1"/>{project.projStatus}</> : 
                  <><Clock size={16} className="m-1"/>{project.projStatus}</>
                }
              </div>
            </div>
            <h3 className="p-2 page-main-title page-dark-light-text">
              {project.name}
            </h3>
            <p className="p-2 page-dark-light-text">
              {project.briefDesc}
            </p>
            <div className="flex justify-between p-2 page-gray-text">
              <div className="flex items-center m-1">
                <Users size={16}/>
                <span className="px-1">{project.memberCount === 1? "1 member" : project.memberCount + " members"}</span>
              </div>
              <div className="flex items-center m-1">
                <SquareCheckBig size={16}/>
                <span className="px-1">{project.taskDone}/{project.taskCount} {project.taskCount <= 1? "task" : "tasks"}</span>
              </div>
            </div> 
            <div className="flex items-center p-2 page-gray-text">
              <Calendar size={16} className="m-1"/>{project.detailedDate}
            </div>   
            <div className="flex justify-between p-2 page-progress-text">
              <p>Progress</p>
              <p>{project.progress}%</p>
            </div>
            <div className="page-progress-div">
              <div
                className="page-progress-bar"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}