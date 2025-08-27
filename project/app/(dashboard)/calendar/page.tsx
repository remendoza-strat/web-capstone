"use client"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@clerk/nextjs";
import { getUserId, getUserProjects, getUserTasks } from "@/lib/db/tanstack";
import LoadingPage from "@/components/pages/loading";
import ErrorPage from "@/components/pages/error";
import { useEffect, useState } from "react";
import { Task } from "@/lib/db/schema";
import { CalendarView } from "@/components/calendar-view";

export default function CalendarPage() {
  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  const [allTasks, setAllTasks] = useState<Task[] | null>(null);

  // Get user id
  const { 
    data: userId, 
    isLoading: userIdLoading, 
    error: userIdError 
  } = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get user tasks
  const {
    data: userTasks, 
    isLoading: userTasksLoading, 
    error: userTasksError 
  } = getUserTasks(userId ?? "", { enabled: Boolean(userId) });

  // Show loading and error
  const isLoading = !userLoaded || userIdLoading || userTasksLoading;
  const isError = userIdError || userTasksError;


useEffect(() => {
  if(!userTasks) return;
  const tasksOnly = userTasks.map((ta) => ta.task);
  setAllTasks(tasksOnly);
}, [userTasks]);
  
  return(
    <DashboardLayout>
      {isLoading ? (<LoadingPage/>) : isError ? (<ErrorPage code={404} message="Fetching data error"/>) : (
        <>
          <CalendarView tasks={allTasks ?? []}/>
        </>
      )}
    </DashboardLayout>
  );
}