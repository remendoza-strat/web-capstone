"use client"
import "./globals.css"
import { useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { getUserIdAction, createProjectAction, addProjectMemberAction } from "@/lib/db/actions"
import type { NewProject, NewProjectMember } from "@/lib/db/schema"
import { ProjectSchema } from "@/lib/validations"
import { Role, RoleArr } from "@/lib/customtype"

export function CreateProjectButton({ close } : { close : () => void }){
  // Hooks for input
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState<Role>("Project Manager");

  // Get current user  
  const { user } = useUser();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get clerk id of user
    const clerkId = user!.id;

    // Get user id with clerk id
    const ownerId = (await getUserIdAction(clerkId))!;

    // Validate input
    const result = ProjectSchema.safeParse({
      name,
      description,
      dueDate
    });

    // Display error from validation
    if(!result.success){
      const errors = result.error.flatten().fieldErrors;
      if(errors.name?.[0]){
        toast.error(errors.name[0]);
        return;
      }
      if(errors.description?.[0]){
        toast.error(errors.description[0]);
        return;
      }
      if(errors.dueDate?.[0]){
        toast.error(errors.dueDate[0]);
        return;
      }
    }

    // Create object of new project
    const newProject: NewProject = {
      ownerId,
      name,
      description,
      dueDate: new Date(dueDate)
    };
    
    // Add and get the project id of the created project
    const projectId = (await createProjectAction(newProject))!;

    // Create object of new project member
    const newProjectMember: NewProjectMember = {
      projectId: projectId,
      userId: ownerId,
      role: role
    }

    // Add member to the project
    addProjectMemberAction(newProjectMember);
    
    // Display success and close the modal
    toast.success("Project created.");
    close();
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open-bg">
      <div className="w-full max-w-md p-6 mx-4 rounded-lg modal-form-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Create New Project
          </h3>
          <button onClick={close} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block m-2 modal-form-label">
              Name
            </label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              type="text" placeholder="Enter project name"
              className="w-full modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Description
            </label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="Enter project description"
              className="w-full modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Due Date
            </label>
            <input
              value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              type="datetime-local"
              className="w-full cursor-pointer modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Your Role
            </label>
            <select
              className="w-full cursor-pointer modal-form-input"
              value={role} onChange={(e) => setRole(e.target.value as Role)}
            >
              {RoleArr.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button onClick={close} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}