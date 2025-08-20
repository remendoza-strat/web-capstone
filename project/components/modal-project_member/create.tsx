"use client"
import { X, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { NewProjectMember, User } from "@/lib/db/schema"
import { Role, RoleArr } from "@/lib/customtype"
import type { ProjectsWithMembers } from "@/lib/customtype"
import { hasPermission } from "@/lib/permissions"
import { createProjectMember, getAllUsers } from "@/lib/hooks/projectMembers"
import { UserAvatar } from "@/components/user-avatar"
import { useModal } from "@/lib/states"
import ErrorPage from "@/components/pages/error"
import LoadingCard from "@/components/pages/loading"

export function CreateProjectMember({ userId, projectsData, onProjectSelect } : { userId: string; projectsData: ProjectsWithMembers[]; onProjectSelect?: (projectId: string) => void; }){
  // Modal closing
  const { closeModal } = useModal();

  // Hook for selected project
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Hook for user suggestion
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ user: User; role: Role }[]>([]);

  // Get projects where user can add member to
  const projects: ProjectsWithMembers[] = projectsData
    .filter((project) => project.members.some((member) => member.userId === userId && member.approved && hasPermission(member.role, "addMember")));

  // Create project member
  const createMutation = createProjectMember(userId);

  // Get all users
  const {
          data: allUsers, 
          isLoading: allUsersLoading, 
          error: allUsersError
        }
  = getAllUsers();

  // Set initial selected project
  useEffect(() => {
    if(projects.length > 0){
      setSelectedProjectId(projects[0].id);
    }
  }, []);

  // Remove selected and suggestion when project is changed
  useEffect(() => {
    setSuggestions([]);
    setSelectedUsers([]);
  }, [selectedProjectId]);

  // Getting suggested user and removing already selected user
  useEffect(() => {
    const timeout = setTimeout(async () => {
      // Empty suggestion
      if(!query || !selectedProjectId){
        setSuggestions([]);
        return;
      }
      
      // Get the selected project
      const selectedProject = projects.find((p) => p.id === selectedProjectId);
      
      if(allUsers){
        // Get users that can be added to the project
        const projectMemberIds = selectedProject?.members.map((m) => m.user.id);
        const freeUsers = allUsers.filter((au) => !projectMemberIds?.includes(au.id));

        // Remove already added users
        const selectedIds = selectedUsers.map((u) => u.user.id);
        const nonSeletected = freeUsers.filter((f) => !selectedIds.includes(f.id));

        // Search user
        const search = query.toLowerCase();
        const userList = nonSeletected.filter((user) => 
          (user.lname).toLowerCase().includes(search) ||
          (user.fname).toLowerCase().includes(search) ||
          (user.email).toLowerCase().includes(search)
        )
        setSuggestions(userList);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, selectedUsers]);

  // Add selected user to array
  const handleAddUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, { user, role: "Project Manager" }]);
    setQuery("");
    setSuggestions([]);
  };

  // Handle change in selected role
  const handleRoleChange = (index: number, newRole: Role) => {
    const updated = [...selectedUsers];
    updated[index].role = newRole;
    setSelectedUsers(updated);
  };

  // Remove user from array
  const handleRemoveUser = (index: number) => {
    const updated = [...selectedUsers];
    updated.splice(index, 1);
    setSelectedUsers(updated);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate project
    if(!selectedProjectId){
      toast.error("Must select a project to add member to.");
      return;
    }
    
    // Validate member
    if(selectedUsers.length === 0){
      toast.error("Must select at least one user to be added.");
      return;
    }

    // Add user to project
    try{
      for(const { user, role } of selectedUsers){
        const newProjectMember: NewProjectMember = {
          projectId: selectedProjectId,
          userId: user.id,
          role: role,
          approved: false,
        };
        await createMutation.mutateAsync({ newProjectMember });
      }
      toast.success("Project membership invitation sent.");
      closeModal();
      onProjectSelect?.(selectedProjectId);
    } 
    catch(error){
      toast.error("Error occurred.");
      closeModal();
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {allUsersLoading? (<LoadingCard/>) : allUsersError? (<ErrorPage code={404} message="Fetching data error"/>) :
          (
            <>
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add Team Member
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project
                  </label>
                  <select
                    className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 cursor-pointer dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    {projects.length === 0 ? 
                      (
                        <option disabled>No projects available</option>
                      ) : 
                      (
                        projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))
                      )
                    }
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search Users
                  </label>
                  <div className="relative">
                    <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500"/>
                    <input
                      className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      type="text" 
                      placeholder="Search by name or email"
                      value={query} onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 z-10 mt-1 overflow-y-auto bg-white border border-gray-200 shadow-lg top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl max-h-48">
                        {suggestions.map((user) => (
                          <li
                            key={user.id}
                            className="flex items-center px-4 py-3 space-x-3 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => handleAddUser(user)}
                          >
                            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full">
                              <UserAvatar clerkId={user.clerkId}/>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.fname} {user.lname}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {selectedUsers.length > 0 && (
                  <div>
                    <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Selected Users
                    </label>
                    <div className="space-y-3 overflow-y-auto max-h-48">
                      {selectedUsers.map((selected, index) => (
                        <div
                          key={selected.user.id}
                          className="flex items-center justify-between gap-3 p-3 border border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-xl dark:border-gray-600"
                        >
                          <div className="flex items-center flex-1 min-w-0 space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full">
                              <UserAvatar clerkId={selected.user.clerkId}/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate dark:text-white">
                                {selected.user.fname} {selected.user.lname}
                              </div>
                              <div className="text-sm text-gray-600 truncate dark:text-gray-300">
                                {selected.user.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0 space-x-2">
                            <select
                              className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 cursor-pointer rounded-xl dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              value={selected.role} onChange={(e) => handleRoleChange(index, e.target.value as Role)}
                            >
                              {RoleArr.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveUser(index)}
                              className="p-2 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400"/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex pt-4 space-x-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl"
                  >
                    {createMutation.isPending? 
                      "Adding Member..."
                      : `Add ${selectedUsers.length > 0 ? `${selectedUsers.length} ` : ""}Member${selectedUsers.length !== 1 ? "s" : ""}`}
                  </button>
                </div>
              </form>
            </>
          )
        }
      </div>
    </div>
  );
}