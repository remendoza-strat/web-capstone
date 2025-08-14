import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTaskAction, deleteTaskAction, updateTaskAction } from "@/lib/db/actions"
import { NewTask, tasks } from "@/lib/db/schema"

// Uses updateTaskAction()
export function updateTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, updTask } : { taskId: string; updTask: Partial<typeof tasks.$inferInsert> }) => {
      await updateTaskAction(taskId, updTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-display"] }) 
    }
  });
}

// Uses deleteTaskAction()
export function deleteTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTaskAction(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-display"] }) 
    }
  });
}

// Uses createTaskAction()
export function createTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: NewTask) => {
      const data = await createTaskAction(newTask);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  });
}