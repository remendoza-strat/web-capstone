"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getProjectById } from "@/lib/hooks/projects";
import { getUserId } from "@/lib/hooks/users";
import ErrorPage from "@/components/pages/error";
import LoadingPage from "@/components/pages/loading";
import { useModal } from "@/lib/states";
import ProjectMainPage from "./project-main-page";

// UUID validation helper
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const { user, isLoaded: isUserLoaded } = useUser();
  const { isOpen, modalType, openModal } = useModal();

  // Validate projectId early to avoid invalid DB queries
  if (!projectId || !isValidUUID(projectId)) {
    return <ErrorPage code={404} message="Invalid project ID" />;
  }

  const {
    data: userId,
    isLoading: isUserIdLoading,
    error: userIdError,
  } = getUserId(user?.id ?? "", {
    enabled: Boolean(user?.id),
  });

  const {
    data: projectData,
    isLoading: isProjectLoading,
    error: projectError,
  } = getProjectById(projectId, {
    enabled: Boolean(projectId),
  });

if (!isUserLoaded) return <LoadingPage />;

if (isUserIdLoading || isProjectLoading) return <LoadingPage />;

if (userIdError) return <ErrorPage code={403} message="User not found or unauthorized" />;
if (!userId) return <ErrorPage code={403} message="User not found or unauthorized" />;

if (projectError) return <ErrorPage code={404} message="Project not found" />;
if (!projectData) return <ErrorPage code={404} message="Project not found" />;


const isMember = projectData.members?.some((m) => m.userId === userId) ?? false;
if (!isMember) {
  return <ErrorPage code={403} message="Access denied: not a project member" />;
}

return (<ProjectMainPage projectData={projectData} />)
}
