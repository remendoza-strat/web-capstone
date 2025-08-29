"use client"
import { toast } from "sonner"
import { AlertTriangle, X } from "lucide-react"
import { useModal } from "@/lib/states"
import { projects, Task, tasks } from "@/lib/db/schema"
import { TaskWithAssignees } from "@/lib/customtype"
import { KanbanDeleteTask, KanbanUpdateProject, KanbanUpdateTask } from "@/lib/db/tanstack"

export function DeleteColumn({ columnIndex, columnNames, boardTasks, projectId } : { columnIndex: number; columnNames: string[]; boardTasks: TaskWithAssignees[]; projectId: string }){
  // Closing modal
  const { closeModal } = useModal();

  // Deleting and updating mutation
  const deleteColumnMutation = KanbanUpdateProject();
	const deleteTaskMutation = KanbanDeleteTask();
	const updateTaskMutation = KanbanUpdateTask();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check count of column
    if(columnNames.length <= 3){
      toast.error("The minimum kanban column is 3.");
      closeModal();
      return;
    }

    // Delete column tasks
    if(boardTasks.length > 0){
      const deleteTasks = boardTasks.filter((task) => task.position === columnIndex);
      try{
        for(const task of deleteTasks){
          await deleteTaskMutation.mutateAsync({ projectId: projectId, taskId: task.id });
        }
      } 
      catch{
        toast.error("Error occurred.");
        return;
      }

      // Adjust column position of affected tasks
      if(columnIndex  < columnNames.length - 1){
        const tasksList = boardTasks.map((task) => {
          if(task.position > columnIndex){
            return {...task, position: task.position - 1}
          }
          return task;
        });
        const updateTasks = tasksList.map(({ assignees, ...task }) => task as Task);
          try{
            for(const task of updateTasks){
              const updTask: Partial<typeof tasks.$inferInsert> = {
                position: task.position,
                updatedAt: new Date(),
              };
              await updateTaskMutation.mutateAsync({ projectId: projectId, taskId: task.id, updTask: updTask });
            }
          } 
        catch{
          toast.error("Error occurred.");
          return;
        }
      }
    }
        
    // Update list of column names
    const names = columnNames.filter((_, index) => index !== columnIndex);
    const count = columnNames.length - 1;
    
    // Setup project data to update
    const updProject: Partial<typeof projects.$inferInsert> = {
      columnCount: count,
      columnNames: names,
      updatedAt: new Date()
    }

    // Update project  
    deleteColumnMutation.mutate({ projectId: projectId, updProject: updProject },{
      onSuccess: () => {
        toast.success("Column deleted successfully.");
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
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400"/>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Delete Column
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center mb-4 space-x-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Are you sure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You are about to delete <strong>"{columnNames[columnIndex]}"</strong> column. This action will permanently remove the column and all its tasks.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deleteColumnMutation.isPending || deleteTaskMutation.isPending || updateTaskMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {deleteColumnMutation.isPending || deleteTaskMutation.isPending || updateTaskMutation.isPending? "Deleting Column..." : "Delete Column"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}