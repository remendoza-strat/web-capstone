import {FolderCheck, FolderX, Clock, AlarmClockOff} from "lucide-react";

export function DashboardStats({activeProj, overdueProj, activeTask, overdueTask} : {activeProj: number; overdueProj: number; activeTask: number; overdueTask: number}) {
const values = [
  { name: "Active Project", value: activeProj, icon: FolderCheck },
  { name: "Overdue Project", value: overdueProj, icon: FolderX },
  { name: "Active Task", value: activeTask, icon: Clock },
  { name: "Overdue Task", value: overdueTask, icon: AlarmClockOff },
];

  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((val) => (
        <div
          key={val.name}
          className="overflow-hidden bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue_munsell-100 dark:bg-blue_munsell-900">
                <val.icon className="text-blue_munsell-500" size={20} />
              </div>
            </div>
            <div className="flex-1 w-0 ml-5">
              <dl>
                <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                  {val.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">{val.value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
