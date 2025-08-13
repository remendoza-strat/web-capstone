"use client"
import { validate as isUuid } from "uuid";
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { UpdateProject } from "@/components/projects-modal/update";
import { DeleteProject } from "@/components/projects-modal/delete";
import { useModal } from "@/lib/states";
import { hasPermission } from "@/lib/permissions";
import { ProjectsWithTasks, Role } from "@/lib/customtype";
import { DateTimeFormatter } from "@/lib/utils";
import { getProjectData, getProject } from "@/lib/hooks/projects"
import { getUserId } from "@/lib/hooks/users"

export default function ProjectPage(){
  // Get project id from parameter
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  // Modal state
  const { isOpen, modalType, openModal } = useModal();

  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Check if valid project id
  if(!projectId || !isUuid(projectId)){
    return <ErrorPage code={404} message="Invalid project ID."/>;
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

  // Get project with project id
  const {
          data: project,
          isLoading: projectLoading,
          error: projectError
        } 
  = getProject(projectId, { enabled: Boolean(projectId) });

  // Show loading page if still processing
  if (!userLoaded || userIdLoading || projectDataLoading || projectLoading) return <LoadingPage/>;

  // Display error for queries
  if (userIdError || !userId) return <ErrorPage code={403} message="User not found."/>;
  if (projectDataError || !projectData || projectError || !project) return <ErrorPage code={404} message="Project not found."/>;

  // Check if the user is member of the project
  const isMember = projectData.members?.some((m) => m.userId === userId) ?? false;
  if(!isMember){
    return <ErrorPage code={403} message="Not a project member."/>;
  }
  
  // User role
  const role: Role = projectData.members.find((m) => m.userId === userId)?.role as Role;
  const editProject = hasPermission(role, "editProject");

  // Remove members in project data for updating project
  const projectWithTasks: ProjectsWithTasks = (({ members, ...rest }) => rest)(projectData);












  
   return (
      <DashboardLayout>
        {isOpen && modalType === "updateProject" && <UpdateProject projectData={projectWithTasks}/>}
        {isOpen && modalType === "deleteProject" && <DeleteProject projectId={projectId}/>}
  
        <div className="space-y-6">

          <div className="flex items-center justify-between">
  
            <div className="flex items-center space-x-4">
              <Link
                href="/projects"
                className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
                  {project.name}
                </h1>
                <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                  {project.description}
                </p>
                <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                  {DateTimeFormatter(project.dueDate)}
                </p>
              </div>
            </div>
  
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
                <Calendar size={20} />
              </button>
              <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
                <Users size={20} />
              </button>
              {editProject && (
                <>
                  <button
                    className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
                    onClick={() => openModal("updateProject")}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
                    onClick={() => openModal("deleteProject")}
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
  
          </div>
              {/**
               <KanbanBoard editProject={editProject} projectData={projectData}/>
               */}
        </div>
  
      </DashboardLayout>
  );
}