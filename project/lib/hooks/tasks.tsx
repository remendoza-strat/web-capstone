import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTaskAction, updateTaskAction } from "@/lib/db/actions"
import { tasks } from "@/lib/db/schema"

// Uses updateTaskAction()
export function updateTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, updTask } : { taskId: string; updTask: Partial<typeof tasks.$inferInsert> }) => {
      await updateTaskAction(taskId, updTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] }) 
    }
  });
}

// Uses deleteTaskAction()
export function deleteTask(){
  return useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTaskAction(taskId);
    }
  });
}