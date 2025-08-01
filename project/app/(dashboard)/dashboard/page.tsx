"use client"
import { FolderOpenDot , UserRoundPlus, StickyNote   } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { CreateProjectButton } from "@/components/create-project-button"
import { AddMemberButton } from "@/components/add-member-button"
import { getUserMembershipAction, getUserIdAction, 
  getUserActiveProjectCountAction, getUserOverdueProjectCountAction, 
  getUserActiveTaskCountAction, getUserOverdueTaskCountAction,
  getUserProjectsInfoAction } from '@/lib/db/actions';
import { useUser } from "@clerk/nextjs";
import { QueryProject } from "@/lib/customtype"
import { CreateTaskButton } from "@/components/create-task-button"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProjects } from "@/components/recent-projects"
import { UserRecentProject } from "@/lib/customtype"

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [projects, setProjects] = useState<QueryProject[]>([]);
  const { user } = useUser();
  const [activeProj, setActiveProj] = useState(0);
  const [overdueProj, setOverdueProj] = useState(0);
  const [activeTask, setActiveTask] = useState(0);
  const [overdueTask, setOverdueTask] = useState(0);
  const [recentProj, setRecentProj] = useState<UserRecentProject[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const clerkId = user!.id;
      const userId = (await getUserIdAction(clerkId))!;
      const projectList = await getUserMembershipAction(userId);
      setProjects(projectList);

      const activeProj = await getUserActiveProjectCountAction(userId);
      setActiveProj(activeProj);
      const overdueProj = await getUserOverdueProjectCountAction(userId);
      setOverdueProj(overdueProj);
      const activeTask = await getUserActiveTaskCountAction(userId);
      setActiveTask(activeTask);
      const overdueTask = await getUserOverdueTaskCountAction(userId);
      setOverdueTask(overdueTask);

      const recentProj = await getUserProjectsInfoAction(userId);
      setRecentProj(recentProj);

      
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

  {/*PARENT DIV */}

        <DashboardStats activeProj={activeProj} overdueProj={overdueProj} activeTask={activeTask} overdueTask={overdueTask}/>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

          <div className="lg:col-span-8">
            <RecentProjects recentProj={recentProj}/>
          </div>
          

          {/* Quick Actions */}
          <div className="p-5 border page-card lg:col-span-4">
            <h3 className="mb-5 page-section-main">Quick Actions</h3>
            <div className="space-y-3">
              
              <button 
                className="flex items-center justify-start w-full px-4 py-3 border rounded-lg text-page_dark bg-page_blue-100 border-french_gray-300 hover:bg-opacity-80"
                onClick={() => {setIsOpen(true); setModalType("project");}}>
                  <div className="p-3 m-3 rounded-xl bg-page_blue">
                    <FolderOpenDot  size={20} className="text-black "/>  
                  </div>   
                   <div className="flex flex-col items-start m-3">
                    <p className="font-extrabold">Create New Project</p>
                    <span className="text-sm text-page_light">Create a new project to plan</span>
                  </div>
              </button>
              <button 
                className="flex items-center justify-start w-full px-4 py-3 border rounded-lg bg-page_blue border-french_gray-300 text-page_dark hover:bg-opacity-75"
                onClick={() => {setIsOpen(true); setModalType("member")}}>
                  <div className="p-3 m-3 rounded-xl bg-page_blue-100">
                    <UserRoundPlus  size={20} className="text-black "/>  
                  </div>
                  <div className="flex flex-col items-start m-3">
                    <p className="font-bold">Add Team Member</p>
                    <span className="text-sm text-page_gray">Invite a user to collaborate</span>
                  </div>
              </button>
              <button 
                className="flex items-center justify-start w-full px-4 py-3 border rounded-lg text-page_dark bg-page_blue border-french_gray-300 hover:bg-opacity-75"
                onClick={() => {setIsOpen(true); setModalType("task")}}>
                  <div className="p-3 m-3 rounded-xl bg-page_blue-100">
                    <StickyNote  size={20} className="text-black "/>  
                  </div>
                  <div className="flex flex-col items-start m-3">
                    <p className="font-bold">Create New Task</p>
                    <span className="text-sm text-page_gray">Add a task to your project</span>
                  </div>
              </button>




              
            </div>
            
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}