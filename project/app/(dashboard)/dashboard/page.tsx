"use client"
import { useState, useEffect } from "react"
import { FolderOpenDot, LayoutDashboard } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateProjectButton } from "@/components/create-project-button"
import { AddMemberButton } from "@/components/add-member-button"
import { CreateTaskButton } from "@/components/create-task-button"
import { getUserIdAction, getUserProjectsAction } from "@/lib/db/actions"
import { RecentProjects } from "@/components/page-dashboard/recent-projects"
import type { UserProjects } from "@/lib/customtype"
import { getUserId } from "@/lib/hooks/users"
import { getUserProjects } from "@/lib/hooks/projectMembers"
import { useModal } from "@/lib/states"
import LoadingPage from "@/components/pages/loading"
import ErrorPage from "@/components/pages/error"
import { StatsCards } from "@/components/page-dashboard/stats-cards"
import { QuickActions } from "@/components/page-dashboard/quick-actions"
import { CreateProjectMember } from "@/components/modal-project_member/create"
import { CreateProject } from "@/components/modal-project/create"
import { CreateTask } from "@/components/modal-task/create"

export default function DashboardPage(){
  // Opening modal
  const { isOpen, modalType } = useModal();
  
  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Get user id
  const { 
          data: userId, 
          isLoading: userIdLoading, 
          error: userIdError 
        } 
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get projects with members
  const {
          data: userProjs, 
          isLoading: userProjsLoading, 
          error: userProjsError 
  } = getUserProjects(userId ?? "", { enabled: Boolean(userId) });

  // Show loading
  const isLoading = !userLoaded || userIdLoading || userProjsLoading;

  // Show error
  const isError = userIdError || userProjsError;




  return(
    <DashboardLayout>
      {isLoading ? (<LoadingPage/>) : isError ? (<ErrorPage code={404} message="Fetching data error"/>) : (

        
        
         <> 
         {isOpen && modalType === "createProject" && userId && <CreateProject userId={userId}/>}
         {isOpen && modalType === "createMember" && userId && <CreateProjectMember userId={userId} projectsData={userProjs ?? []}/>}
        {isOpen && modalType === "createTask" && userId && <CreateTask userId={userId} projectsData={userProjs ?? []}/>}
      
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                    <LayoutDashboard className="w-8 h-8 mr-3 text-blue-600" />
                    Dashboard
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your projects.</p>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <StatsCards userProjs={userProjs ?? []}/>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RecentProjects userProjs={userProjs ?? []}/>
              </div>
              <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions/>
          </div>
            </div>
     </>
   
      )}
    </DashboardLayout>
  );
}