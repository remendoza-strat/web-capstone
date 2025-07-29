"use client"
import "./globals.css"
import { X, Trash } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { NewProjectMember } from "@/lib/db/schema"
import { getNonProjectMembersAction, addProjectMemberAction } from "@/lib/db/actions"
import { ProjectMemberSchema } from "@/lib/validations"
import { QueryUser, QueryProject, Role, RoleArr } from "@/lib/customtype"

export function AddMemberButton({ close, projects } : { close: () => void; projects: QueryProject[] }) {
  // Hook for project
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Hook for user
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<QueryUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ user: QueryUser; role: Role }[]>([]);

  // Set initial selected project if not empty
  useEffect(() => {
    if(projects.length > 0){
      setSelectedProjectId(projects[0].projectId);
    }
  }, [projects]);

  // Getting suggested user and removing already selected user
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if(!query || !selectedProjectId){
        setSuggestions([]);
        return;
      }
      const users = await getNonProjectMembersAction(selectedProjectId, query);
      const selectedIds = selectedUsers.map((u) => u.user.userId);
      setSuggestions(users.filter((u) => !selectedIds.includes(u.userId)));
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedProjectId, query, selectedUsers]);

  // Add selected user to array
  const handleAddUser = (user: QueryUser) => {
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
      const newMember: NewProjectMember = {
        projectId: selectedProjectId,
        userId: user.userId,
        role
      }; 
      await addProjectMemberAction(newMember);
    }

    // Display success and close modal
    toast.success("All members added.");
    close();
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open-bg">
      <div className="w-full max-w-md p-6 mx-4 rounded-lg modal-form-color">
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
                    <option key={project.projectId} value={project.projectId}>
                      {project.projectName}
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
                      {suggestions.map((sug) => (
                        <li
                          key={sug.userId}
                          className="modal-form-suggestion-li"
                          onClick={() => handleAddUser(sug)}>
                            <div className="modal-form-suggestion-main">
                              {sug.userFname} {sug.userLname}
                            </div>
                            <div className="modal-form-suggestion-sec">{sug.userEmail}</div>
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
                {selectedUsers.map((item, index) => (
                  <li key={item.user.userId} className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="modal-form-suggestion-main">
                        {item.user.userFname} {item.user.userLname}
                      </div>
                      <div className="modal-form-suggestion-sec">{item.user.userEmail}</div>
                    </div>
                    <select
                      className="modal-form-input w-fit"
                      value={item.role} onChange={(e) => handleRoleChange(index, e.target.value as Role)}>
                        {RoleArr.map((r) => (
                          <option key={r} value={r}>
                            {r}
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