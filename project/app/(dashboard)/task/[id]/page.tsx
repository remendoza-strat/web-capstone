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
import { getProjectData, getTaskData } from "@/lib/hooks/projectMembers"
import { getUserId } from "@/lib/hooks/users"
import { UpdateProject } from "@/components/modal-project/update"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import { DeleteProject } from "@/components/modal-project/delete"
import { LeaveProject } from "@/components/modal-extras/leave-project"
import { KanbanBoard } from "@/components/kanban/kanban-board"

export default function TaskPage(){
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
  const isMember = taskData.project.members.some((m) => m.userId === userId && m.approved) ?? false;
  if(!isMember){
    return <ErrorPage code={403} message="Not a project member"/>;
  }

  // User role
  const role = taskData.project.members.find((m) => m.userId === userId)?.role as Role;
  const editTask = hasPermission(role, "editTask");

  return(
		<DashboardLayout>
			<h1>HI</h1>
		</DashboardLayout>
  );
}