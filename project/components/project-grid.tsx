import { UserProjects } from "@/lib/customtype"
import { ComputeProgress, DateTimeFormatter, DaysLeft, LimitChar } from "@/lib/utils";
import { Plus, Search, Filter, Users, SquareCheckBig, Clock } from "lucide-react"


export function ProjectGrid({ userProjs } : { userProjs: UserProjects[] }) {

  // Get important data per project
  const projects = userProjs.map((project) => {
    const [dateLabel, dateStatus] = DaysLeft(project.dueDate);
    const briefDesc = LimitChar(project.description, 120);
    const memberCount = project.members.length;
    const taskDone = (project.tasks.filter((t) => t.position === 100)).length;
    const taskCount = project.tasks.length;
    const detailedDate = DateTimeFormatter(project.dueDate);
    const progress = ComputeProgress(project.tasks);
    return{
      ...project, dateLabel, dateStatus, briefDesc, memberCount, 
      taskDone, taskCount, detailedDate, progress
    };
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-end">
            <div className={`flex p-2 items-center text-sm text-payne's_gray-500 dark:text-french_gray-400 ${project.dateLabel == "active" ? "bg-green-300" : "bg-red-500"}`}>
              <Clock size={16} className="m-1"/>{project.dateStatus}
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
            {project.name}
          </h3>

          <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
            {project.description}
          </p>

          <div className="flex justify-between text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
            <div className="flex">
              <div className="flex items-center m-1">
                <Users size={16}/>
                <span className="px-1">{project.memberCount}</span>
              </div>
              <div className="flex items-center m-1">
                <SquareCheckBig size={16}/>
                <span className="px-1">{project.taskDone}/{project.taskCount}</span>
              </div>
            </div>
            <div>
              {project.detailedDate}
            </div>    
          </div>

          <div className="flex justify-between">
            <p>Progress</p>
            <p>{project.progress}%</p>
          </div>

          <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue_munsell-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
