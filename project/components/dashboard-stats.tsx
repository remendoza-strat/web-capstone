import { FolderCheck, FolderX, Clock, AlarmClockOff } from "lucide-react"

export function DashboardStats({ activeProj, overdueProj, activeTask, overdueTask } : { activeProj: number; overdueProj: number; activeTask: number; overdueTask: number }){
  
  // Storage of data to display
  const values = [
    { name: "Active Project", value: activeProj, icon: FolderCheck },
    { name: "Overdue Project", value: overdueProj, icon: FolderX },
    { name: "Active Task", value: activeTask, icon: Clock },
    { name: "Overdue Task", value: overdueTask, icon: AlarmClockOff }
  ];

  return(
    <div className="flex flex-col md:flex-row">
      {values.map((val) => (
        <div key={val.name} className="flex-1 p-5 m-3 border page-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 page-icon-bg">
                <val.icon className="page-icon-color" size={30}/>
              </div>
            </div>
            <div className="flex-1 w-0 ml-5">
              <dl>
                <dt className="page-gray-text">
                  {val.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="page-stats-value">
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