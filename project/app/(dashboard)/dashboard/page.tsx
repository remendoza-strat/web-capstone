"use client"
import { useState, useEffect } from "react"
import { FolderOpenDot } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateProjectButton } from "@/components/create-project-button"
import { AddMemberButton } from "@/components/add-member-button"
import { CreateTaskButton } from "@/components/create-task-button"
import { getUserIdAction, getUserTasksAction, getUserProjectsAction } from "@/lib/db/actions"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProjects } from "@/components/recent-projects"
import type { Task } from "@/lib/db/schema"
import type { UserProjects } from "@/lib/customtype"

export default function DashboardPage(){
  // Hooks for modal
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Hook for getting current user
  const { user } = useUser();

  // Hook for data to send to components
  const [userId, setUserId] = useState("");
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [userProjs, setUserProjs] = useState<UserProjects[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try{
        // Return if user is null
        if (!user) return;
        
        // Get clerk id
        const clerkId = user.id;
        if (!clerkId) return;
        
        // Get user id with clerk id
        const userId = await getUserIdAction(clerkId);
        if (!userId) return;
        setUserId(userId);

        // Get user tasks
        const userTasks = await getUserTasksAction(userId);
        setUserTasks(userTasks);

        // Get user projects
        const userProjs = await getUserProjectsAction(userId);
        setUserProjs(userProjs);
      }
      catch{return}
    };
    fetchData();
  }, [user, isOpen]);

  return(
    <DashboardLayout>
      {isOpen && modalType === "project" && (
        <CreateProjectButton close={() => setIsOpen(false)} userId={userId}/>
      )}
      {isOpen && modalType === "member" && (
        <AddMemberButton close={() => setIsOpen(false)} userId={userId} userProjs={userProjs}/>
      )}
      {isOpen && modalType === "task" && (
        <CreateTaskButton close={() => setIsOpen(false)} userId={userId} userProjs={userProjs}/>
      )}
      <div className="space-y-6 ">
        <DashboardStats userProjs={userProjs} userTasks={userTasks}/>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 lg:items-start">
          <div className="xl:col-span-7">
            <RecentProjects userProjs={userProjs}/>
          </div>
          <div className="p-5 border xl:col-span-5 page-gray-border">
            <h3 className="mb-5 page-section-main">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                className="flex items-center justify-start w-full px-4 py-3 page-main-btn"
                onClick={() => {setIsOpen(true); setModalType("project");}}>
                  <div className="p-3 m-3 page-btn-icon">
                    <FolderOpenDot size={20}/>  
                  </div>   
                  <div className="flex flex-col items-start m-3">
                    <p className="page-btn-main-text">
                      Create New Project
                    </p>
                    <span className="page-btn-sub-text">
                      Start a new project to plan
                    </span>
                  </div>
              </button>
              <button 
                className="flex items-center justify-start w-full px-4 py-3 page-sub-btn"
                onClick={() => {setIsOpen(true); setModalType("member");}}>
                  <div className="p-3 m-3 page-btn-icon">
                    <FolderOpenDot size={20}/>  
                  </div>   
                  <div className="flex flex-col items-start m-3">
                    <p className="page-btn-main-text">
                      Add Team Member
                    </p>
                    <span className="page-btn-sub-text">
                      Invite a user to collaborate
                    </span>
                  </div>
              </button>
              <button 
                className="flex items-center justify-start w-full px-4 py-3 page-sub-btn"
                onClick={() => {setIsOpen(true); setModalType("task");}}>
                  <div className="p-3 m-3 page-btn-icon">
                    <FolderOpenDot size={20}/>  
                  </div>   
                  <div className="flex flex-col items-start m-3">
                    <p className="page-btn-main-text">
                      Create New Task
                    </p>
                    <span className="page-btn-sub-text">
                      Add a task to your project
                    </span>
                  </div>
              </button>
            </div>    
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}