import "./globals.css"
import { UserProjects } from "@/lib/customtype"
import { ComputeProgress, DateTimeFormatter, DaysLeft, LimitChar } from "@/lib/utils"
import { Calendar, Users, SquareCheckBig, Clock } from "lucide-react"

export function ProjectGrid({ filteredProjs } : { filteredProjs: UserProjects[] }){
  // Get important data per project
  const projects = filteredProjs.map((project) => {
    const [dateLabel, dateStatus] = DaysLeft(project.dueDate);
    const briefDesc = LimitChar(project.description, 120);
    const memberCount = (project.members.length);
    const taskDone = (project.tasks.filter((t) => t.position === 100)).length;
    const taskCount = project.tasks.length;
    const detailedDate = DateTimeFormatter(project.dueDate);
    const progress = ComputeProgress(project.tasks);
    return{
      ...project, dateLabel, dateStatus, briefDesc, memberCount, 
      taskDone, taskCount, detailedDate, progress
    };
  });

  return(
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="p-5 border page-card">
          <div className="flex justify-end">
            <div className={`flex p-1 items-center ${project.dateLabel == "active" ? "page-tag-active" : "page-tag-overdue"}`}>
              <Clock size={16} className="m-1"/>{project.dateStatus}
            </div>
          </div>
          <h3 className="p-2 page-main-title">
            {project.name}
          </h3>
          <p className="p-2 page-sub-text">
            {project.briefDesc}
          </p>
          <div className="flex justify-between p-2 page-gray-text">
            <div className="flex items-center m-1">
              <Users size={16}/>
              <span className="px-1">{project.memberCount == 1? "1 member" : project.memberCount + " members"}</span>
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
      ))}
    </div>
  );
}