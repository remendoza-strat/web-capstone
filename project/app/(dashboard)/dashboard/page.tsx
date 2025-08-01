"use client"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { FolderOpenDot } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateProjectButton } from "@/components/create-project-button"
import { AddMemberButton } from "@/components/add-member-button"
import { CreateTaskButton } from "@/components/create-task-button"
import { getUserIdAction, getDashboardData } from "@/lib/db/actions"
import { QueryProject, UserRecentProject } from "@/lib/customtype"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProjects } from "@/components/recent-projects"

export default function DashboardPage(){
  // Hooks for modal
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Hook for getting current user
  const { user } = useUser();

  // Hooks for data of dashboard page
  const [projects, setProjects] = useState<QueryProject[]>([]);
  const [activeProj, setActiveProj] = useState(0);
  const [overdueProj, setOverdueProj] = useState(0);
  const [activeTask, setActiveTask] = useState(0);
  const [overdueTask, setOverdueTask] = useState(0);
  const [recentProj, setRecentProj] = useState<UserRecentProject[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try{
        // Return if user is null
        if (!user) return;
        
        // Get clerk id
        const clerkId = user.id;
        if (!clerkId) return;
        
        // Get user id with clerk id
        const userId = await getUserIdAction(clerkId);
        if (!userId) return;

        // Get necessary dashboard data
        const{ projects, activeProj, overdueProj, activeTask, overdueTask, recentProj } = await getDashboardData(userId);
        setProjects(projects);
        setActiveProj(activeProj);
        setOverdueProj(overdueProj);
        setActiveTask(activeTask);
        setOverdueTask(overdueTask);
        setRecentProj(recentProj);
      }
      catch{return}
    };
    fetchProjects();
  }, [user, isOpen]);

  return(
    <DashboardLayout>
      {isOpen && modalType === "project" && (
        <CreateProjectButton close={() => setIsOpen(false)}/>
      )}
      {isOpen && modalType === "member" && (
        <AddMemberButton close={() => setIsOpen(false)} projects={projects}/>
      )}
      {isOpen && modalType === "task" && (
        <CreateTaskButton close={() => setIsOpen(false)} projects={projects}/>
      )}
      <div className="space-y-6 ">
        <DashboardStats activeProj={activeProj} overdueProj={overdueProj} activeTask={activeTask} overdueTask={overdueTask}/>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 lg:items-start">
          <div className="xl:col-span-7">
            <RecentProjects recentProj={recentProj}/>
          </div>
          <div className="p-5 border xl:col-span-5 page-card">
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