import { toast } from "sonner"
import React, { useState } from "react"
import { X, Type } from "lucide-react"
import { projects } from "@/lib/db/schema"
import { useModal } from "@/lib/states"
import { ProjectSchema } from "@/lib/validations"
import { KanbanUpdateProject } from "@/lib/db/tanstack"

export function CreateColumn({ columnNames, projectId } : { columnNames: string[]; projectId: string }){
  // Closing modal
  const { closeModal } = useModal();

  // Get column name
  const [columnName, setColumnName] = useState("");

  // Adding column
  const createMutation = KanbanUpdateProject();
    
  // Handle add
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      
    // Setup project data to update
    const updProject: Partial<typeof projects.$inferInsert> = {
			columnCount: (columnName.length + 1),
			columnNames: [...columnNames, columnName],
			updatedAt: new Date()
    }
        
    // Update project  
    createMutation.mutate({ projectId: projectId, updProject }, {
      onSuccess: () => {
        toast.success("Column created successfully.");
        closeModal();
      },
      onError: () => {
        toast.error("Error occured.");
        closeModal();
      }
    });
  }

   return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Column
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Type className="inline w-4 h-4 mr-2"/>
              Column Name
            </label>
            <input
              type="text"
              value={columnName} onChange={(e) => setColumnName(e.target.value)}
              placeholder="Enter column name"
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex pt-4 space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {createMutation.isPending? "Creating Column..." : "Create Column"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}