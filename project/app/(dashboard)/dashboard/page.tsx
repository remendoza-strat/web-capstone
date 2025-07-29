"use client"

import { TrendingUp, Users, CheckCircle, Clock, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { CreateProjectButton } from "@/components/create-project-button"
import { AddMemberButton } from "@/components/add-member-button"
import { getUserMembershipAction, getUserIdAction } from '@/lib/db/actions';
import { useUser } from "@clerk/nextjs";
import { QueryProject } from "@/lib/customtype"
import { CreateTaskButton } from "@/components/create-task-button"

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [projects, setProjects] = useState<QueryProject[]>([]);
  const { user } = useUser();
  
  useEffect(() => {
    const fetchProjects = async () => {
      const clerkId = user!.id;
      const userId = (await getUserIdAction(clerkId))!;
      const projectList = await getUserMembershipAction(userId);
      setProjects(projectList);
    };
    if (user) fetchProjects();
  }, [isOpen]);
  
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Dashboard</h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
            Welcome back! Here's an overview of your projects and tasks.
          </p>
        </div>

        {/* Stats Grid - Placeholder */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Active Projects", value: "12", icon: TrendingUp, change: "+2.5%" },
            { name: "Team Members", value: "24", icon: Users, change: "+4.1%" },
            { name: "Completed Tasks", value: "156", icon: CheckCircle, change: "+12.3%" },
            { name: "Pending Tasks", value: "43", icon: Clock, change: "-2.1%" },
          ].map((stat) => (
            <div
              key={stat.name}
              className="overflow-hidden bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue_munsell-100 dark:bg-blue_munsell-900">
                    <stat.icon className="text-blue_munsell-500" size={20} />
                  </div>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                        {stat.value}
                      </div>
                      <div className="flex items-baseline ml-2 text-sm font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <div className="bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6">
            <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">Recent Projects</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-platinum-800 dark:bg-outer_space-400"
                >
                  <div>
                    <div className="font-medium text-outer_space-500 dark:text-platinum-500">Project {i}</div>
                    <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                      Last updated 2 hours ago
                    </div>
                  </div>
                  <div className="w-12 h-2 bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full">
                    <div className="w-8 h-2 rounded-full bg-blue_munsell-500"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 mt-4 border border-yellow-200 rounded bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📋 <strong>Task 4.1:</strong> Implement project CRUD operations
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 p-6">
            <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">Quick Actions</h3>
            <div className="space-y-3">
              
              
              
              <button 
                className="flex items-center justify-center w-full px-4 py-3 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors"
                onClick={() => {setIsOpen(true); setModalType("project");}}>
                  <Plus size={20} className="mr-2" />
                  Create New Project
              </button>
              <button 
                className="flex items-center justify-center w-full px-4 py-3 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors"
                onClick={() => {setIsOpen(true); setModalType("member")}}>
                  <Plus size={20} className="mr-2" />
                  Add Team Member
              </button>
              <button 
                className="flex items-center justify-center w-full px-4 py-3 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors"
                onClick={() => {setIsOpen(true); setModalType("task")}}>
                  <Plus size={20} className="mr-2" />
                  Create New Task
              </button>




              
            </div>
            <div className="p-4 mt-4 border border-yellow-200 rounded bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📋 <strong>Task 4.4:</strong> Build task creation and editing functionality
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}