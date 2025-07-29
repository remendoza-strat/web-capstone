"use client"
import "./globals.css"
import { X } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { NewProjectMember } from "@/lib/db/schema"
import { getNonMembersOfProjectAction, addProjectMemberAction } from "@/lib/db/actions"
import { ProjectMemberSchema } from "@/lib/validations"
import { QueryUser, QueryProject, Role } from "@/lib/customtype"

export function AddMemberButton({ close, projects }: { close: () => void; projects: QueryProject[] }){
  // Selecting project id hook
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Selecting user hooks
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<QueryUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<QueryUser | null>(null);

  // Selecting role hook
  const [role, setRole] = useState<Role>("Project Manager");

  // Set first project as selected if not empty
  useEffect(() => {
    if(projects.length > 0){
      setSelectedProjectId(projects[0].projectId);
    }
  }, [projects]);

  // Getting users based on project id and query
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if(!query || !selectedProjectId){
        setSuggestions([]);
        return;
      }
      const users = await getNonMembersOfProjectAction(selectedProjectId, query);
      setSuggestions(users);
    }, 300);  
    return () => clearTimeout(timeout);
  }, [query, selectedProjectId]);

  // Form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the fields
    const result = ProjectMemberSchema.safeParse({
      projectId: selectedProjectId,
      userId: selectedUser?.userId!,
      role: role 
    });

    // Display validation errors
    if(!result.success){
      const errors = result.error.flatten().fieldErrors;
      if(errors.projectId?.[0]){
        toast.error(errors.projectId[0]);
        return;
      }
      if(errors.userId?.[0]){
        toast.error(errors.userId[0]);
        return;
      }
    }

    // Create object of type project member
    const newProjectMember: NewProjectMember = {
      projectId: selectedProjectId,
      userId: selectedUser?.userId!,
      role: role 
    }

    // Add member to the project
    addProjectMemberAction(newProjectMember);

    // Display success
    toast.success("Member added.");
    close();
  }

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
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
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
                value={
                  selectedUser
                    ? `${selectedUser.userFname} ${selectedUser.userLname} (${selectedUser.userEmail})`
                    : query
                }
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedUser(null);
                }}
              />
              {!selectedUser && (
                <ul className="absolute w-full overflow-y-auto z-60 max-h-48 modal-form-suggestion-ul">
                  {suggestions.length > 0 ? (
                    suggestions.map((sug) => (
                      <li
                        className="modal-form-suggestion-li"
                        key={sug.userId}
                        onClick={() => {
                          setSelectedUser({
                            userId: sug.userId,
                            userEmail: sug.userEmail,
                            userFname: sug.userFname,
                            userLname: sug.userLname,
                          });
                          setQuery("");
                          setSuggestions([]);
                        }}
                      >
                        <div className="modal-form-suggestion-main">
                          {sug.userFname} {sug.userLname}
                        </div>
                        <div className="modal-form-suggestion-sec">{sug.userEmail}</div>
                      </li>
                    ))
                  ) : 
                  (
                    query && (
                      <li className="modal-form-suggestion-sec">
                        No users found
                      </li>
                    )
                  )
                }
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Role
            </label>
            <select 
              className="w-full cursor-pointer modal-form-input"
              value={role} onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="Project Manager">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
            </select>
          </div>
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