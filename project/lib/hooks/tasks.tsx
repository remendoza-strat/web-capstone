import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTaskAction, deleteTaskAction, updateTaskAction } from "@/lib/db/actions"
import { NewTask, tasks } from "@/lib/db/schema"
import { getSocketId } from "../pusher/client";

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








// Create task
export function createTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: NewTask) => {
      const socketId = getSocketId();
      return await createTaskAction(newTask, socketId || undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  });
}

// Update task
export function updateTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, updTask } : { taskId: string; updTask: Partial<typeof tasks.$inferInsert> }) => {
      const socketId = getSocketId(); 
      return await updateTaskAction(taskId, updTask, socketId || undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-display"] }) 
    }
  });
}