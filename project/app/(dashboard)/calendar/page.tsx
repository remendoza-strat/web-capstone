"use client"
import { useEffect, useState } from "react"
import { CalendarCheck } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@clerk/nextjs"
import { getUserId, getUserTasks } from "@/lib/db/tanstack"
import LoadingPage from "@/components/pages/loading"
import ErrorPage from "@/components/pages/error"
import { Task } from "@/lib/db/schema"
import { CalendarView } from "@/components/calendar-view"
import { UpcomingTasks } from "@/components/page-calendar/upcoming-tasks"

export default function CalendarPage(){
  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Store all tasks
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

  // Add task to list
  useEffect(() => {
    if(!userTasks) return;
    const tasksOnly = userTasks.map((ta) => ta.task);
    setAllTasks(tasksOnly);
  }, [userTasks]);
  
  return(
    <DashboardLayout>
      {isLoading ? (<LoadingPage/>) : isError ? (<ErrorPage code={404} message="Fetching data error"/>) : (
        <>
          <div className="mb-8">
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <CalendarCheck className="w-8 h-8 mr-3 text-blue-600"/>
              Calendar
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Due dates for your upcoming tasks
            </p>
            <div className="flex flex-col min-h-screen gap-6 mt-8 xl:flex-row xl:overflow-x-hidden">
              <div className="flex-[2] min-w-0 bg-white dark:bg-gray-800 p-5 rounded-xl">
                <CalendarView tasks={allTasks ?? []}/>
              </div>
              <div className="flex-[1] min-w-0 flex flex-col">
                <div className="overflow-y-auto h-[60vh] xl:h-[90vh] p-4">
                  <UpcomingTasks tasks={userTasks ?? []}/>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}