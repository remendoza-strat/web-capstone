"use client"
import { useEffect, useState } from "react"
import { ChevronDown, ChartNoAxesCombined } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserProjects } from "@/lib/customtype"
import { getUserId, getUserProjects } from "@/lib/db/tanstack"
import { useUser } from "@clerk/nextjs"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import { PriorityDistribution } from "@/components/page-analytics/priority-distribution"
import { TaskProgress } from "@/components/page-analytics/task-progress"
import { RoleDistribution } from "@/components/page-analytics/role-distribution"
import { ProjectOverview } from "@/components/page-analytics/project-overview"
import { ProjectStats } from "@/components/page-analytics/project-stats"

export default function AnalyticsPage(){
  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Choosing project
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [allProjects, setAllProjects] = useState<UserProjects[]>([]);
  const [selectedProject, setSelectedProject] = useState<UserProjects | null>(null);

  // Get user id
  const { 
    data: userId, 
    isLoading: userIdLoading, 
    error: userIdError 
  } = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get projects with members
  const {
    data: projectData, 
    isLoading: projectDataLoading, 
    error: projectDataError 
  } = getUserProjects(userId ?? "", { enabled: Boolean(userId) });

  // Show loading and error
  const isLoading = !userLoaded || userIdLoading || projectDataLoading;
  const isError = userIdError || projectDataError;

  // Set initial selected project
  useEffect(() => {
    if (!projectData) return;
    const filteredProjects = projectData.filter(
      (p) => p.members.some((m) => m.userId === userId && m.approved)
    );
    setAllProjects(filteredProjects);
    setSelectedProject(filteredProjects[0]);
  }, [projectData]);

  return(
    <DashboardLayout>
      {isLoading ? (<LoadingPage/>) : isError ? (<ErrorPage code={404} message="Fetching data error"/>) : (
        <>
          <div className="mb-8">
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <ChartNoAxesCombined className="w-8 h-8 mr-3 text-blue-600"/>
              Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Insights and metrics for your projects
            </p>
            <div className="flex justify-end mt-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[200px] justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center">
                    <div className="w-3 h-3 mr-2 rounded-full"/>
                    {selectedProject?.name}
                  </span>
                  <ChevronDown className="w-4 h-4"/>
                </button>
                {showProjectDropdown && (
                  <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 shadow-lg top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                    {allProjects.map((project) => (
                      <button
                        type="button"
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl dark:text-white"
                      >
                        {project.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <ProjectStats project={selectedProject ?? null}/>
          </div>
          <div className="md:col-span-2">
            <RoleDistribution members={selectedProject?.members ?? []}/>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PriorityDistribution tasks={selectedProject?.tasks ?? []}/>
          <TaskProgress project={selectedProject ?? null}/>
        </div>
        <ProjectOverview project={selectedProject ?? null}/>
      </div>
    </DashboardLayout>
  );
}