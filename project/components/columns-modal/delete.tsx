"use client"
import "../globals.css"
import { toast } from "sonner"
import { useState } from "react"
import { X } from "lucide-react"
import { useModal } from "@/lib/states"
import { ProjectSchema } from "@/lib/validations"
import { updateProject } from "@/lib/hooks/projects"
import { projects, tasks } from "@/lib/db/schema"
import { deleteTask, updateTask } from "@/lib/hooks/tasks"
import { ProjectsWithTasks } from "@/lib/customtype"

export function DeleteColumn({ columnIndex, projectData } : { columnIndex: number; projectData: ProjectsWithTasks}){
  const { closeModal } = useModal();
  const [code, setCode] = useState("");
  const deleteColumnMutation = updateProject();
	const deleteTaskMutation = deleteTask();
	const updateTaskMutation = updateTask();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
			// Check count of column
			if(projectData.columnCount <= 3){
				toast.error("Column: Minimum kanban column is 3.");
				return;
			}

    	// Validate input
      const result = ProjectSchema.safeParse({ columnDeleteCode: code });
    
      // Display error from validation
      if(!result.success){
        const errors = result.error.flatten().fieldErrors;
        if(errors.columnDeleteCode?.[0]){
          toast.error(errors.columnDeleteCode[0]);
          return;
        }
      }

      // Delete column tasks
			if(projectData.tasks.length > 0){
				const deleteTasks = projectData.tasks.filter((task) => task.position === columnIndex);
        try{
          for(const task of deleteTasks){
            await deleteTaskMutation.mutateAsync(task.id);
          }
        } 
        catch{
          toast.error("Error occurred.");
          return;
        }

				// Adjust column position of affected tasks
				if((columnIndex + 1) !== projectData.columnCount){
					const updateTasks = projectData.tasks.map((task) => {
						if(task.position > columnIndex){
							return {...task, position: task.position - 1}
						}
						return task;
					});
          try{
            for(const task of updateTasks){
              const updTask: Partial<typeof tasks.$inferInsert> = {
                position: task.position,
                updatedAt: new Date()
						  }
              await updateTaskMutation.mutateAsync({taskId: task.id, updTask});
            }
          } 
          catch{
            toast.error("Error occurred.");
            return;
          }
				}
			}
        
      // Update list of column names
      const columnNames = projectData.columnNames.filter((_, index) => index !== columnIndex);
      const columnCount = projectData.columnCount - 1;
      
      // Setup project data to update
      const updProject: Partial<typeof projects.$inferInsert> = {
        columnCount: columnCount,
        columnNames: columnNames,
        updatedAt: new Date()
      }

			// Update project  
      deleteColumnMutation.mutate({ projectId: projectData.id, updProject }, {
        onSuccess: () => {
          closeModal();
          toast.success("Column deleted successfully.");
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
            Delete Column
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="modal-form-label">
              Type "DELETE THIS COLUMN" to proceed
            </label>
            <input
              value={code} onChange={(e) => setCode(e.target.value)}
              type="text" placeholder="DELETE THIS COLUMN"
              className="modal-form-input"
            />
          </div>
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn" disabled={deleteTaskMutation.isPending || updateTaskMutation.isPending || deleteColumnMutation.isPending}>
              {deleteTaskMutation.isPending || updateTaskMutation.isPending || deleteColumnMutation.isPending? "Deleting..." : "Delete Column"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}