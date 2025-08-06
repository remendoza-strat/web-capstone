"use client"
import "./globals.css"
import { X, Trash } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { NewProjectMember, Project, User } from "@/lib/db/schema"
import { getNonProjectMembersAction, createProjectMemberAction } from "@/lib/db/actions"
import { ProjectMemberSchema } from "@/lib/validations"
import { Role, RoleArr } from "@/lib/customtype"
import type { UserProjects } from "@/lib/customtype"

export function AddMemberButton({ close, userId, userProjs } : { close: () => void; userId: string; userProjs: UserProjects[] }){
  // Get all projects from prop
  const projects: Project[] = userProjs
    .filter((project) => project.members.some((member) => member.userId === userId && member.role === "Project Manager"))
    .map(({ members, tasks, ...project }) => project);
  
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
        const nonmembers = await getNonProjectMembersAction(selectedProjectId);
        const selectedIds = selectedUsers.map((u) => u.user.id);
        const remainingUsers = nonmembers.filter((u) => !selectedIds.includes(u.id));
        const search = query.toLowerCase();
        const userList = remainingUsers.filter((user) => 
            (user.lname).toLowerCase().includes(search) ||
            (user.fname).toLowerCase().includes(search) ||
            (user.email).toLowerCase().includes(search)
          )
        setSuggestions(userList);
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
        await createProjectMemberAction(newProjectMember);
      }

      // Display success and close modal
      toast.success("Project membership invitation sent.");
      close();
    }
    catch{return}
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open-bg">
      <div className="w-full max-w-lg p-6 mx-4 rounded-lg modal-form-color">
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
            <label className="block m-2 modal-form-label">
              Project
            </label>
            <select
              className="w-full cursor-pointer modal-form-input"
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
            <label className="block m-2 modal-form-label">
              User
            </label>
            <div className="relative">
              <input
                className="w-full modal-form-input"
                type="text" placeholder="Search by name or email"
                value={query} onChange={(e) => setQuery(e.target.value)}/>
                  {query && suggestions.length > 0 && (
                    <ul className="absolute w-full overflow-y-auto z-60 max-h-48 modal-form-suggestion-ul">
                      {suggestions.map((user) => (
                        <li
                          key={user.id}
                          className="modal-form-suggestion-li"
                          onClick={() => handleAddUser(user)}>
                            <div className="modal-form-suggestion-main">
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
              <label className="block m-2 modal-form-label">
                Selected Users
              </label>
              <ul className="space-y-2">
                {selectedUsers.map((user, index) => (
                  <li key={user.user.id} className="flex items-center justify-between gap-2 modal-form-input">
                    <div className="flex-1">
                      <div className="modal-form-suggestion-main">
                        {user.user.fname} {user.user.lname}
                      </div>
                      <div className="modal-form-suggestion-sec">{user.user.email}</div>
                    </div>
                    <select
                      className="modal-form-input w-fit"
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
          <div className="flex justify-end pt-4 space-x-3">
            <button onClick={close} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}