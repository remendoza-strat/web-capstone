import { UserProjects } from "@/lib/customtype"
import { ComputeProgress, DateTimeFormatter, LimitChar, ProjectStatus } from "@/lib/utils"
import Link from "next/link"
import { Calendar, Users, CheckSquare, AlertTriangle, CheckCircle, Play } from "lucide-react"
import UserAvatar from "@/components/user-avatar"

export default function ProjectCard({ project } : { project: UserProjects }){
	// Icon display
  function StatusLabel(status: string){
    switch(status){
      case "active":
        return <Play className="w-4 h-4"/>
      case "done":
        return <CheckCircle className="w-4 h-4"/>
      case "overdue":
        return <AlertTriangle className="w-4 h-4"/>
    }
  }

	// Get color of progress bar
  function ProgressColor(progress: number){
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

	// Get color of status label
	function StatusColor(status: string){
		if (status === "done") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
		if (status === "active") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
		if (status === "overdue") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
	}

	// Get project data
	const briefDesc = LimitChar(project.description, 100);
	const detailedDate = DateTimeFormatter(project.dueDate);
	const approvedMembers = project.members.filter((m) => m.approved);
	const taskDone = (project.tasks.filter((t) => t.position === (project.columnCount - 1))).length;
	const taskCount = project.tasks.length;
	const progress = ComputeProgress(project.tasks, project.columnCount);
	const [projLabel, projStatus] = ProjectStatus(project.tasks, project.columnCount, project.dueDate);
	const statusColor = StatusColor(projLabel);
	const statusLabel = StatusLabel(projLabel);

  return(
		<Link href={`projects/${project.id}`} key={project.id}>
			<div className="p-6 transition-all duration-300 bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl group">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-xl font-bold text-gray-900 transition-colors dark:text-white">
								{project.name}
							</h3>
							<span
								className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${statusColor}`}>
								{statusLabel}
								<span>{projStatus.toUpperCase()}</span>
							</span>
						</div>
						<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
							{briefDesc}
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
						<Users className="w-4 h-4 text-blue-500"/>
						<span>{approvedMembers.length} {approvedMembers.length > 1? "members" : "member"}</span>
					</div>
					<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
						<CheckSquare className="w-4 h-4 text-green-500"/>
						<span>{taskDone}/{taskCount} {taskCount > 1? "tasks" : "task"}</span>
					</div>
					<div className="flex items-center col-span-2 space-x-2 text-sm text-gray-600 dark:text-gray-300">
						<Calendar className="w-4 h-4 text-purple-500"/>
						<span>{detailedDate}</span>
					</div>
				</div>
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-1">
						<div className="flex -space-x-2">
							{approvedMembers.slice(0, 5).map((member) => (
								<div
									key={member.id}
									className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white border-2 border-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:border-gray-800"
								>
									<UserAvatar clerkId={member.user.clerkId}/>
								</div>
							))}
							{project.members.length > 5 && (
								<div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white bg-gray-400 border-2 border-white rounded-full dark:bg-gray-600 dark:border-gray-800">
									+{project.members.length - 5}
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
						<span className="font-bold text-gray-900 dark:text-white">{progress}%</span>
					</div>
					<div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
						<div
							className={`h-3 rounded-full transition-all duration-500 ${ProgressColor(
								progress
							)}`}
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			</div>
		</Link>
  );
}