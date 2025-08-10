"use client"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { getProjectById } from "@/lib/hooks/projects"
import { getUserId } from "@/lib/hooks/users"
import { ValidID } from "@/lib/utils"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import ProjectMainPage from "@/app/(dashboard)/projects/[id]/project-main-page"

export default function ProjectPage(){
  // Get project id from parameter
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  // Get current user
  const { user, isLoaded: isUserLoaded } = useUser();

  // Check if valid project id
  if(!projectId || !ValidID(projectId)){
    return <ErrorPage code={404} message="Invalid project ID"/>;
  }

  // Get user id with clerk id
  const {
    data: userId,
    isLoading: isUserIdLoading,
    error: userIdError
  } = getUserId(user?.id ?? "", {
    enabled: Boolean(user?.id)
  });

  // Get project data with project id
  const {
    data: projectData,
    isLoading: isProjectDataLoading,
    error: projectDataError
  } = getProjectById(projectId, {
    enabled: Boolean(projectId)
  });

  // Show loading page when user is not loaded or queries are loading
  if (!isUserLoaded || isUserIdLoading || isProjectDataLoading) return <LoadingPage/>;

  // Display error for queries
  if (userIdError || !userId) return <ErrorPage code={403} message="User not found"/>;
  if (projectDataError || !projectData) return <ErrorPage code={404} message="Project not found"/>;

  // Check if the user is member of the project
  const isMember = projectData.members?.some((m) => m.userId === userId) ?? false;
  if(!isMember){
    return <ErrorPage code={403} message="Not a project member"/>;
  }

  // Display the main page
  return <ProjectMainPage projectData={projectData}/>
}