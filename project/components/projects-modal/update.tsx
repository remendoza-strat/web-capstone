"use client"
import "../globals.css"
import { toast } from "sonner"
import { useState } from "react"
import { X } from "lucide-react"
import { useModal } from "@/lib/states"
import { ProjectSchema } from "@/lib/validations"
import { updateProject } from "@/lib/hooks/projects"
import { projects, Task, Project } from "@/lib/db/schema"
import { FormatDateDisplay } from "@/lib/utils"

export function UpdateProject({ project, tasks } : { project: Project; tasks: Task[] }){
  const { closeModal } = useModal();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [dueDate, setDueDate] = useState(FormatDateDisplay(project.dueDate));
  const updateMutation = updateProject();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      // Check if there are tasks due beyond new project due date
      var isOverlap;
      if(tasks.length === 0){
        isOverlap = false;
      }
      else{
        const taskDue = tasks.map((task) => new Date(task.dueDate)).reduce((max, date) => (date > max ? date : max));
        isOverlap = new Date(taskDue) > new Date(dueDate);
      }

      // Show error if task due overlap
      if(isOverlap){
        toast.error("Due Date: Tasks due date is beyond the new project due.");
        return;
      }

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

      // Setup project data to update
      const updProject: Partial<typeof projects.$inferInsert> = {
        name: name,
        description: description,
        dueDate: new Date(dueDate),
        updatedAt: new Date()
      }
          
      // Update project  
      updateMutation.mutate({ projectId: project.id, updProject }, {
        onSuccess: () => {
          closeModal();
          toast.success("Project updated successfully.");
        },
        onError: () => {
          closeModal();
          toast.error("Error occured.");
        }
      });
    }
    catch{return}
  }

  return(
    <div className="modal-background">
      <div className="max-w-md modal-form">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Update Project
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="modal-form-label">
              Name
            </label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              type="text" placeholder="Enter project name"
              className="modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              Description
            </label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="Enter project description"
              className="modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              Due Date
            </label>
            <input
              value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              type="datetime-local"
              className="cursor-pointer modal-form-input"
            />
          </div>
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn" disabled={updateMutation.isPending}>
              {updateMutation.isPending? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}