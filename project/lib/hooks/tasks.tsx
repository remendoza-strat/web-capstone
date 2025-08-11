import { useMutation } from "@tanstack/react-query"
import { updateTaskAction } from "@/lib/db/actions"
import { tasks } from "@/lib/db/schema"

// Uses updateTaskAction()
export function updateTask(){
  return useMutation({
    mutationFn: async ({ taskId, updTask } : { taskId: string; updTask: Partial<typeof tasks.$inferInsert> }) => {
      await updateTaskAction(taskId, updTask);
    }
  });
}