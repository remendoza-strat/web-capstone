"use client"
import { useState } from "react"
import { validate as isUuid } from "uuid"
import { useParams } from "next/navigation"
import { Calendar, DoorOpen, Edit2, Kanban, Trash2, Users } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useModal } from "@/lib/states"
import { hasPermission } from "@/lib/permissions"
import { Role } from "@/lib/customtype"
import { DateTimeFormatter } from "@/lib/utils"
import { getProjectData } from "@/lib/hooks/projectMembers"
import { getUserId } from "@/lib/hooks/users"
import { UpdateProject } from "@/components/modal-project/update"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import { DeleteProject } from "@/components/modal-project/delete"

// List tabs
const tabs = [
  { id: "kanban", label: "Kanban Board", icon: Kanban },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "member", label: "Members", icon: Users }
];

export default function ProjectPage(){
  // Get current selected tab
  const [activeTab, setActiveTab] = useState<string>("kanban");

  // Get project id from parameter
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  // Modal state
  const { isOpen, modalType, openModal } = useModal();

  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Check if valid project id
  if(!projectId || !isUuid(projectId)){
    return <ErrorPage code={404} message="Invalid project ID"/>;
  }

  // Get user id with clerk id
  const {
          data: userId,
          isLoading: userIdLoading,
          error: userIdError
        }
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get project data with project id
  const {
          data: projectData,
          isLoading: projectDataLoading,
          error: projectDataError
        } 
  = getProjectData(projectId, { enabled: Boolean(projectId) });

  // Show loading page if still processing
  if (!userLoaded || userIdLoading || projectDataLoading) return <LoadingPage/>;

  // Display error for queries
  if (userIdError || !userId) return <ErrorPage code={403} message="User not found"/>;
  if (projectDataError || !projectData) return <ErrorPage code={404} message="Project not found"/>;

  // Check if the user is member of the project
  const isMember = projectData.members.some((m) => m.userId === userId) ?? false;
  if(!isMember){
    return <ErrorPage code={403} message="Not a project member"/>;
  }
  
  // User role
  const role = projectData.members.find((m) => m.userId === userId)?.role as Role;
  const editProject = hasPermission(role, "editProject");

  return(
    <DashboardLayout>
      {isOpen && modalType === "updateProject" && <UpdateProject userId={userId} projectData={projectData}/>}
      {isOpen && modalType === "deleteProject" && <DeleteProject userId={userId} projectData={projectData}/>}
        <div className="space-y-6">
          <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 mb-4 lg:mb-0">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {projectData.name}
                </h1>
                <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                  {projectData.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2"/>
                    <span>Due: {DateTimeFormatter(projectData.dueDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {editProject &&
                <>
                  <button
                    type="button"
                    onClick={() => openModal("updateProject")}
                    className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="w-4 h-4"/>
                    <span>Update</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal("deleteProject")}
                    className="flex items-center px-4 py-2 space-x-2 font-medium text-red-700 transition-colors bg-white border border-red-300 dark:text-red-400 dark:bg-gray-700 dark:border-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4"/>
                    <span>Delete</span>
                  </button>
                </>
                }
                <button
                  type="button"
                  onClick={() => openModal("leaveProject")}
                  className="flex items-center px-4 py-2 space-x-2 font-medium text-orange-700 transition-colors bg-white border border-orange-300 dark:text-orange-400 dark:bg-gray-700 dark:border-orange-600 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <DoorOpen className="w-4 h-4"/>
                  <span>Leave</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-2 mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}
                  `}
                >
                  <tab.icon className="w-5 h-5"/>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeTab === "kanban" && <div>Kanban Board</div>}
              {activeTab === "calendar" && <div>Calendar View</div>}
              {activeTab === "member" && <div>Team Members</div>}
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}