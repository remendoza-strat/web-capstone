"use client"
import { useEffect, useState } from "react"
import { Filter, Search, FolderOpen, UserPlus, FolderArchive, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RoleArr, UserProjects } from "@/lib/customtype"
import { getUserProjects } from "@/lib/hooks/projectMembers"
import { getUserId } from "@/lib/hooks/users"
import { useUser } from "@clerk/nextjs"
import { useModal } from "@/lib/states"
import { ProjectCard } from "@/components/page-project/project-card"
import { ProjectsByStatus, ProjectsByDueDate, ProjectsByRole } from "@/lib/utils"
import { CreateProject } from "@/components/modal-project/create"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"

export default function ProjectsPage(){
  // Create project modal
  const { isOpen, modalType, openModal } = useModal();
  
  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Hooks for UI
  const [showFilters, setShowFilters] = useState(false);

  // Hooks for search and filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState("");

  // Hooks for data display
  const [projectsData, setProjectsData] = useState<UserProjects[]>([]);

  // Get user id
  const { 
          data: userId, 
          isLoading: userIdLoading, 
          error: userIdError 
        } 
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get user projects
  const {
          data: userProjs, 
          isLoading: userProjsLoading, 
          error: userProjsError 
  } = getUserProjects(userId ?? "", { enabled: Boolean(userId) });

  // Show loading
  const isLoading = !userLoaded || userIdLoading || userProjsLoading;

  // Show error
  const isError = userIdError || userProjsError;

  // Add contents
  useEffect(() => {
    if(userProjs){
      const projects = userProjs.filter((p) => p.members.some((m) => m.userId === userId && m.approved))
      setProjectsData(projects);
    }
  }, [userProjs]);

  // Filtering effect
  useEffect(() => {
    const delay = setTimeout(() => {
      const query = search.toLowerCase();

      if(!userProjs || !userId)return;

      const projects = userProjs.filter((p) => p.members.some((m) => m.userId === userId && m.approved));
      let result = projects.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query));

      if(showFilters){
        result = ProjectsByStatus(status, result);
        result = ProjectsByDueDate(dueDate, result);
        result = ProjectsByRole(userId, role, result);
      }

      setProjectsData(result);
    }, 300);
    return () => clearTimeout(delay);
  }, [search, status, dueDate, role, showFilters]);

  return(
    <DashboardLayout>
      {isLoading ? (<LoadingPage/>) : isError ? (<ErrorPage code={404} message="Fetching data error"/>) : (
          <>
            {isOpen && modalType === "createProject" && userId && <CreateProject userId={userId}/>}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                    <FolderArchive className="w-8 h-8 mr-3 text-blue-600"/>
                    Projects
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">View and manage your projects</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => openModal("createProject")}
                    className="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 shadow-md hover:bg-blue-700 rounded-xl"
                  >
                    <Plus className="w-5 h-5"/>
                    <span>Create Project</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500"/>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 space-x-2 text-gray-900 transition-colors bg-white border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <Filter className="w-5 h-5"/>
                  <span>Filters</span>
                </button>
              </div>
              {showFilters && (
                <div className="flex flex-wrap gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Role
                    </label>
                    <select
                      value={role} onChange={(e) => setRole(e.target.value)}
                      className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-xl dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Roles</option>
                      {RoleArr.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={status} onChange={(e) => setStatus(e.target.value)}
                      className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-xl dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Status</option>
                      <option value="done">Done</option>
                      <option value="active">Active</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      All Dates
                    </label>
                    <select
                      value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-xl dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            {projectsData?.length === 0? 
              (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full dark:bg-gray-800">
                    <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500"/>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">No project found</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">Create or join projects in dashboard</p>
                </div>
              ) : 
              (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectsData.map((project) => (userId &&
                  <ProjectCard key={project.id} project={project}/>
                ))}
              </div>
            )}
          </>
        )
      }
    </DashboardLayout>
  );
}