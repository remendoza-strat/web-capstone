"use client"
import "../globals.css"
import { X, Trash } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { NewProjectMember, Project, User } from "@/lib/db/schema"
import { createProjectMemberAction } from "@/lib/db/actions"
import { ProjectMemberSchema } from "@/lib/validations"
import { Role, RoleArr } from "@/lib/customtype"
import type { ProjectsWithMembers, UserProjects } from "@/lib/customtype"
import { hasPermission } from "@/lib/permissions"
import { createProjectMember, getAllUsers } from "@/lib/hooks/projectMembers"
import LoadingPage from '../pages/loading';
import ErrorPage from "../pages/error"
import LoadingCard from "../pages/loading-card"
import {UserAvatar} from "@/components/user-avatar"
import { projects } from '../../lib/db/schema';

export function CreateProjectMember({ userId, projectData } : { userId: string; projectData: ProjectsWithMembers[] }){

  const projects: ProjectsWithMembers[] = projectData
    .filter((project) => project.members.some((member) => member.userId === userId && hasPermission(member.role, "addMember")))

  // Create project member
  const createMutation = createProjectMember();

  // Get all users
  const {
          data: allUsers, 
          isLoading: allUsersLoading, 
          error: allUsersError
        }
  = getAllUsers();

  // Show error
  if (allUsersError) return <ErrorPage code={404} message="Fetching data error"/>
  










  
  // Hook for project
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Hook for user
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ user: User; role: Role }[]>([]);

  // Set initial selected project
  useEffect(() =>{
    if(projects.length > 0){
      setSelectedProjectId(projects[0].id);
    }
  }, []);

  // Remove selected and suggestion when project is changed
  useEffect(() =>{
    setSuggestions([]);
    setSelectedUsers([]);
  }, [selectedProjectId]);

  // Getting suggested user and removing already selected user
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try{
        if(!query || !selectedProjectId){
          setSuggestions([]);
          return;
        }
        
        // get the selected project
        const selectedProject = projects.find((p) => p.id === selectedProjectId);
        
        if(allUsers){
    
          // get the id of all the members of the selected project
          const projectMembersId = selectedProject?.members.map((m) => m.user.id);

          // remove all users that id is not in project members
          const freeUsers = allUsers.filter((au) => !projectMembersId?.includes(au.id));

          // get id of selected users
          const selectedIds = selectedUsers.map((u) => u.user.id);

          // remove selected users from users that is not in project members
          const nonSeletected = freeUsers.filter((f) => !selectedIds.includes(f.id));

        

        const search = query.toLowerCase();
        const userList = nonSeletected.filter((user) => 
            (user.lname).toLowerCase().includes(search) ||
            (user.fname).toLowerCase().includes(search) ||
            (user.email).toLowerCase().includes(search)
          )
        setSuggestions(userList);
        }
      }
      catch{return}
    }, 200);
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

    try{
      // Validate project and members
      const result = ProjectMemberSchema.safeParse({
        projectId: selectedProjectId,
        members: selectedUsers
      });

      // Display errors
      if(!result.success){
        const errors = result.error.flatten().fieldErrors;
        if(errors.projectId?.[0]){
          toast.error(errors.projectId[0]);
          return;
        } 
        if(errors.members?.[0]){
          toast.error(errors.members[0]);
          return;
        } 
      }

      // Iterate the array and add user content to database
      for(const { user, role } of selectedUsers){
        const newProjectMember: NewProjectMember = {
          projectId: selectedProjectId,
          userId: user.id,
          role: role,
          approved: false
        }; 
        await createMutation.mutateAsync({newProjectMember});
      }

      // Display success and close modal
      toast.success("Project membership invitation sent.");
      close();
    }
    catch{return}
  };

  return(
    <div>
    
    <div className="modal-background">
      
      <div className="max-w-lg modal-form">
        {allUsersLoading? <LoadingCard/> : (<>
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Add Team Member
          </h3>
          <button onClick={close} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="modal-form-label">
              Project
            </label>
            <select
              className="cursor-pointer modal-form-input"
              value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                {projects.length === 0 ? (
                  <option disabled>No projects available</option>
                ) : 
                (
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))
                )}
            </select>
          </div>
          <div>
            <label className="modal-form-label">
              User
            </label>
            <div className="relative">
              <input
                className="modal-form-input"
                type="text" placeholder="Search by name or email"
                value={query} onChange={(e) => setQuery(e.target.value)}/>
                  {query && suggestions.length > 0 && (
                    <ul className="modal-form-suggestion-ul">
                      {suggestions.map((user) => (
                        <li
                          key={user.id}
                          className="modal-form-suggestion-li"
                          onClick={() => handleAddUser(user)}>
                            <div className="modal-form-suggestion-main">
                              <UserAvatar clerkId={user.clerkId} name={`${user.fname} ${user.lname}`} />
                              {user.fname} {user.lname}
                            </div>
                            <div className="modal-form-suggestion-sec">{user.email}</div>
                        </li>
                      ))}
                    </ul>
                  )}
            </div>
          </div>
          {selectedUsers.length > 0 && (
            <div>
              <label className="modal-form-label">
                Selected Users
              </label>
              <ul className="space-y-2">
                {selectedUsers.map((user, index) => (
                  <li key={user.user.id} className="flex items-center justify-between gap-2 modal-form-input">
                    <div className="flex-1">
                      <div className="modal-form-suggestion-main">
                        <UserAvatar clerkId={user.user.clerkId} name={`${user.user.fname} ${user.user.lname}`} />
                        {user.user.fname} {user.user.lname}
                      </div>
                      <div className="modal-form-suggestion-sec">{user.user.email}</div>
                    </div>
                    <select
                      className="cursor-pointer modal-form-input"
                      value={user.role} onChange={(e) => handleRoleChange(index, e.target.value as Role)}>
                        {RoleArr.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                    </select>
                    <button type="button" onClick={() => handleRemoveUser(index)}>
                      <Trash className="modal-form-trash" size={18}/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal-btn-div">
            <button onClick={close} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn" disabled={createMutation.isPending}>
              {createMutation.isPending? "Adding...": "Add Member"}
            </button>
          </div>
        </form>
      </>)}</div>
    
    </div>
    
    </div>
    
  );
}