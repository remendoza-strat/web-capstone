"use client"
import "../globals.css"
import { toast } from "sonner"
import { useState } from "react"
import { X } from "lucide-react"
import { useModal } from "@/lib/states"
import { ProjectSchema } from "@/lib/validations"
import { updateProject } from "@/lib/hooks/projects"
import { projects } from "@/lib/db/schema"

export function UpdateColumn({columnIndex, columnNames, projectId } : { columnIndex: number; columnNames: string[]; projectId: string }){
  const { closeModal } = useModal();
  const [columnName, setColumnName] = useState(columnNames[columnIndex]);
  const updateMutation = updateProject();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      // Validate input
      const result = ProjectSchema.safeParse({ columnName });
    
      // Display error from validation
      if(!result.success){
        const errors = result.error.flatten().fieldErrors;
        if(errors.columnName?.[0]){
          toast.error(errors.columnName[0]);
          return;
        }
      }

      // Update list of column names
      const updatedNames = [...columnNames];
      updatedNames[columnIndex] = columnName;

      // Setup project data to update
      const updProject: Partial<typeof projects.$inferInsert> = {
        columnNames: updatedNames,
        updatedAt: new Date()
      }
          
      // Update project  
      updateMutation.mutate({ projectId: projectId, updProject }, {
        onSuccess: () => {
          closeModal();
          toast.success("Column updated successfully.");
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
            Update Column
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="modal-form-label">
              Column Name
            </label>
            <input
              value={columnName} onChange={(e) => setColumnName(e.target.value)}
              type="text" placeholder="Enter column name"
              className="modal-form-input"
            />
          </div>
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn" disabled={updateMutation.isPending}>
              {updateMutation.isPending? "Updating..." : "Update Column"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}