import "./globals.css"
import { FolderCheck, FolderX, Clock, AlarmClockOff } from "lucide-react"
import type { Task } from "@/lib/db/schema"
import type { UserProjects } from "@/lib/customtype"

export function DashboardStats({ userProjs, userTasks } : { userProjs: UserProjects[]; userTasks: Task[] }){
  // Active and overdue project computation
  const activeProjs = (userProjs.filter((p) => 
    p.dueDate > new Date() && 
    p.tasks.some((t) => t.position < 100))).length;
  const overdueProjs = (userProjs.filter((p) => 
    p.dueDate < new Date() &&
    p.tasks.some((t) => t.position < 100))).length;

  // Active and overdue task computation
  const activeTasks = (userTasks.filter((t) => 
    t.dueDate > new Date() && 
    t.position < 100)).length;
  const overdueTasks = (userTasks.filter((t) => 
    t.dueDate < new Date() &&
    t.position < 100)).length;

  // Put values together
  const values = [
    { name: "Active Project", value: activeProjs, icon: FolderCheck },
    { name: "Overdue Project", value: overdueProjs, icon: FolderX },
    { name: "Active Task", value: activeTasks, icon: Clock },
    { name: "Overdue Task", value: overdueTasks, icon: AlarmClockOff }
  ];

  return(
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {values.map((val) => (
        <div key={val.name} className="p-5 border page-gray-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 page-light-blue-bg">
                <val.icon className="page-dark-blue-text" size={30}/>
              </div>
            </div>
            <div className="flex-1 w-0 ml-5">
              <dl>
                <dt className="page-gray-text">
                  {val.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="page-stats-value page-light-dark-text">
                    {val.value}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}