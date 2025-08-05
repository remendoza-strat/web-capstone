"use client"
import { Plus, Search, Filter, Users, SquareCheckBig, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserIdAction, getUserProjectsAction } from "@/lib/db/actions";
import { UserProjects } from '../../../lib/customtype';
import { ComputeProgress, DateTimeFormatter, DaysLeft, LimitChar } from "@/lib/utils";
import { ProjectGrid } from "@/components/project-grid";

export default function ProjectsPage() {
  const { user } = useUser();
  const [userProjs, setUserProjs] = useState<UserProjects[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if(!user) return;

      const clerkId = user.id;
      if(!clerkId) return;

      const userId = await getUserIdAction(clerkId);
      if(!userId) return;

      const userProjs = await getUserProjectsAction(userId);
      setUserProjs(userProjs);
    }
    fetchData();
  }, [user])


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Projects</h1>
            <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">Manage and organize your team projects</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-blue_munsell-500 hover:bg-blue_munsell-600">
            <Plus size={20} className="mr-2" />
            New Project
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute transform -translate-y-1/2 left-3 top-1/2 text-payne's_gray-500 dark:text-french_gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full py-2 pl-10 pr-4 bg-white border dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>

        <ProjectGrid userProjs={userProjs}/>

        {/* Component Placeholders */}
        <div className="p-6 mt-8 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600">
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">📁 Components to Implement</h3>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-400">
            <div>
              <strong>components/project-card.tsx</strong>
              <p>Project display component with progress, members, and actions</p>
            </div>
            <div>
              <strong>components/modals/create-project-modal.tsx</strong>
              <p>Modal for creating new projects with form validation</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
