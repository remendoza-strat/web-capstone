"use client"
import { useEffect, useState } from "react"
import { ChevronDown, Filter, Search, Users, UsersRound, FolderOpen, UserPlus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MemberCard } from "@/components/page-team/member-card"
import { ProjectMemberUser, ProjectsWithMembers, RoleArr } from "@/lib/customtype"
import { getUserId, getUserProjectsWithMembers } from "@/lib/db/tanstack"
import { useUser } from "@clerk/nextjs"
import { useModal } from "@/lib/states"
import { hasPermission } from "@/lib/permissions"
import { CreateProjectMember } from "@/components/modal-project_member/create"
import { UpdateProjectMember } from "@/components/modal-project_member/update"
import { DeleteProjectMember } from "@/components/modal-project_member/delete"
import ErrorPage from "@/components/util-pages/error-page"
import LoadingPage from "@/components/util-pages/loading-page"

export default function TeamPage(){
  // Add member modal
  const { isOpen, modalType, openModal } = useModal();
  
  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Hooks for UI
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Hooks for search and filter
  const [search, setSearch] = useState("");
  const [rolesFilter, setRolesFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Hooks for data display
  const [selectedProject, setSelectedProject] = useState("");
  const [projectsData, setProjectsData] = useState<ProjectsWithMembers[]>([]);
  const [members, setMembers] = useState<ProjectMemberUser[]>([]);

  // Hook for project that user added member in
  const [createdAt, setCreatedAt] = useState("");

  // Get user permission
  const [canEditMember, setCanEditMember] = useState(false);

  // For update and delete member
  const [selectedUpdateMember, setSelectedUpdateMember] = useState<ProjectMemberUser | null>(null);
  const [selectedDeleteMember, setSelectedDeleteMember] = useState<ProjectMemberUser | null>(null);

  // Get user id
  const { 
          data: userId, 
          isLoading: userIdLoading, 
          error: userIdError 
        } 
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get projects with members
  const {
          data: projectWithMembers, 
          isLoading: projectWithMembersLoading, 
          error: projectWithMembersError 
  } = getUserProjectsWithMembers(userId ?? "", { enabled: Boolean(userId) });

  // Show loading
  const isLoading = !userLoaded || userIdLoading || projectWithMembersLoading;

  // Show error
  const isError = userIdError || projectWithMembersError;

  // Initial selected project
  useEffect(() => {
    if(projectWithMembers && projectWithMembers.length > 0){
      const currentExists = projectWithMembers.some(
        (pwm) => pwm.project.id === createdAt
      );
      if(createdAt && currentExists){
        setSelectedProject(createdAt);
      }
      else{
        setSelectedProject(projectWithMembers[0].project.id);
      }
      setProjectsData(projectWithMembers?.map((p) => p.project) ?? []);
    }
    else{
      setSelectedProject("");
      setProjectsData([]);
    }
  }, [projectWithMembers]);

  // Initial members of selected project
  useEffect(() => {
    const selectedProjectData = projectWithMembers?.find(
      (pwm) => pwm.project.id === selectedProject);
      const membersData = selectedProjectData?.project.members ?? [];
      setMembers(membersData);

      // Get user and permission
      const user = membersData.find((md) => md.user.id === userId);
      if(user){
        setCanEditMember(hasPermission(user.role, "editMember"))
      }
  }, [selectedProject, projectWithMembers]);

  // Filtering of which members to display
  useEffect(() => {
    if (!projectWithMembers || !selectedProject) return;

    const delay = setTimeout(() => {
      const query = search.toLowerCase();
      const project = projectWithMembers.find((p) => p.project.id === selectedProject)?.project;
      const members = project?.members ?? [];

      const filtered = members.filter((m) => {
        const matchesSearch =
          m.user.fname.toLowerCase().includes(query) ||
          m.user.lname.toLowerCase().includes(query) ||
          m.user.email.toLowerCase().includes(query);
        
        if(showFilters){
          const matchesRole = rolesFilter ? m.role === rolesFilter : true;
          const matchesStatus = statusFilter ? (m.approved ? "approved" : "pending") === statusFilter: true;
          return matchesSearch && matchesRole && matchesStatus;
        }
        return matchesSearch;
      });
      setMembers(filtered);
    }, 300);

    return () => clearTimeout(delay);
  }, [selectedProject, showFilters, search, rolesFilter, statusFilter]);

  return(
    <DashboardLayout>
      {isLoading ? (<LoadingPage/>) : isError ? (<ErrorPage code={404} message="Fetching data error"/>) : (
          <>
            {isOpen && modalType === "createMember" && userId && <CreateProjectMember userId={userId} projectsData={projectsData} onProjectSelect={(projId) => setCreatedAt(projId)}/>}
            {isOpen && modalType === "updateMember" && userId && selectedUpdateMember && (<UpdateProjectMember userId={userId} member={selectedUpdateMember} members={members} onProjectSelect={(projId) => setCreatedAt(projId)}/>)}
            {isOpen && modalType === "deleteMember" && userId && selectedDeleteMember && (<DeleteProjectMember userId={userId} member={selectedDeleteMember} members={members} onProjectSelect={(projId) => setCreatedAt(projId)}/>)}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                    <UsersRound className="w-8 h-8 mr-3 text-blue-600"/>
                    Team
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your team and project assignments</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => openModal("createMember")}
                    className="flex items-center px-6 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 shadow-md hover:bg-blue-700 rounded-xl"
                  >
                    <UserPlus className="w-5 h-5"/>
                    <span>Invite Member</span>
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
                    placeholder="Search members..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[200px] justify-between bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-full"/>
                      {projectsData.find((p) => p.id === selectedProject)?.name}
                    </span>
                    <ChevronDown className="w-4 h-4"/>
                  </button>
                  {showProjectDropdown && (
                    <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 shadow-lg top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                      {projectsData.map((project) => (
                        <button
                          type="button"
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project.id);
                            setShowProjectDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-gray-900 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl dark:text-white"
                        >
                          {project.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 space-x-2 text-gray-900 transition-colors bg-white border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <Filter className="w-5 h-5"/>
                  <span>Filters</span>
                </button>
              </div>
              {showFilters && (
                <div className="flex flex-wrap gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Roles
                    </label>
                    <select
                      value={rolesFilter} onChange={(e) => setRolesFilter(e.target.value)}
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
                      value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-xl dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            {projectWithMembers?.length === 0? 
            (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full dark:bg-gray-800">
                  <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500"/>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">No project found</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">Create or join projects in dashboard</p>
              </div>
            ) : members.length === 0? 
            (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full dark:bg-gray-800">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500"/>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">No member found</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">Try adjusting your search or filters</p>
              </div>
            ) : 
            (
              <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {members.map((member) => (userId &&
                    <MemberCard 
                      key={member.user.id}
                      userId={userId}
                      canEdit={canEditMember}
                      member={member}
                      onUpdateClick={(member) => {
                        setSelectedUpdateMember(member)
                      }}
                      onDeleteClick={(member) => {
                        setSelectedDeleteMember(member)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )
      }
    </DashboardLayout>
  );
}