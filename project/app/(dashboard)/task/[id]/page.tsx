"use client"
//import ReactMarkdown from "react-markdown";
import { useState } from "react"
import { validate as isUuid } from "uuid"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, DoorOpen, Edit2, Flag, Kanban, Save, Tag, Trash2, User, UserMinus, Users, X } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useModal } from "@/lib/states"
import { hasPermission } from "@/lib/permissions"
import { Role } from "@/lib/customtype"
import { DateTimeFormatter, FormatDateDisplay } from "@/lib/utils"
import { getProjectData, getTaskData } from "@/lib/hooks/projectMembers"
import { getUserId } from "@/lib/hooks/users"
import { UpdateProject } from "@/components/modal-project/update"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import { DeleteProject } from "@/components/modal-project/delete"
import { LeaveProject } from "@/components/modal-extras/leave-project"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { UserAvatar } from "@/components/user-avatar"

export default function TaskPage(){

    // Get color of priority
  function PriorityColor(priority: string){
    if (priority === "High") return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
    if (priority === "Medium") return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400";
    if (priority === "Low") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
  };
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Get task id from parameter
  const params = useParams<{ id: string }>();
  const taskId = params.id;

  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Check if valid task id
  if(!taskId || !isUuid(taskId)){
    return <ErrorPage code={404} message="Invalid task ID"/>;
  }

  // Get user id with clerk id
  const {
          data: userId,
          isLoading: userIdLoading,
          error: userIdError
        }
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get task data with task id
  const {
          data: taskData,
          isLoading: taskDataLoading,
          error: taskDataError
        } 
  = getTaskData(taskId, { enabled: Boolean(taskId) });

  // Show loading page if still processing
  if (!userLoaded || userIdLoading || taskDataLoading) return <LoadingPage/>;

  // Display error for queries
  if (userIdError || !userId) return <ErrorPage code={403} message="User not found"/>;
  if (taskDataError || !taskData) return <ErrorPage code={404} message="Task not found"/>;

  // Check if the user is member of the project
  const isMember = taskData.project.members.some((m) => m.userId === userId) ?? false;
  if(!isMember){
    return <ErrorPage code={403} message="Not a project member"/>;
  }

  // User role
  const role = taskData.project.members.find((m) => m.userId === userId)?.role as Role;
  const editTask = hasPermission(role, "editTask");
  const assignee = taskData.assignees.some((a) => a.userId === userId);


  
  return(
		<DashboardLayout>

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl p-4 mx-auto lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            className="flex items-center px-4 py-2 space-x-2 text-gray-600 transition-colors dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Board</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Task Details */}
        <div className="mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
          <div className="p-8">
            {/* Title */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Title
              </label>
              {isEditing ? (
                <input
                  type="text"

                  className="w-full pb-2 text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 dark:text-white focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {taskData.title}
                </h1>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              {isEditing ? (
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 resize-none dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              ) : (
               <h1>HELLO</h1>

              )}
            </div>

            {/* Task Properties */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              {/* Due Date */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Due Date
                </label>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 space-x-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-900 dark:text-white">
                      {DateTimeFormatter(taskData.dueDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Flag className="inline w-4 h-4 mr-2" />
                  Priority
                </label>
                {isEditing ? (
                  <select
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${PriorityColor(taskData.priority)}`}>
                    <Flag className="w-4 h-4" />
                    <span className="capitalize">{taskData.priority}</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Tag className="inline w-4 h-4 mr-2" />
                  Label
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="inline-flex items-center px-3 py-2 space-x-1 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 rounded-xl">
                    <Tag className="w-4 h-4" />
                    <span>{taskData.label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignees */}
            {taskData.assignees.length > 0 && (
              <div className="mb-8">
                <h4 className="flex items-center mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                  Assignees ({taskData.assignees.length})
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {taskData.assignees.map((assignee) => (
                    <div key={assignee.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <UserAvatar clerkId={assignee.user.clerkId}/>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {assignee.user.fname} {assignee.user.lname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {assignee.user.email}
                          </div>
                        </div>
                      </div>
                      {isEditing && (
                        <button

                          className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                          title="Remove assignee"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      
</div>








		</DashboardLayout>
  );
}