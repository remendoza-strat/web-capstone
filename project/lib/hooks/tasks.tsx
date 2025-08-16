import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTaskAction, deleteTaskAction, updateTaskAction } from "@/lib/db/actions"
import { NewTask, tasks } from "@/lib/db/schema"
import { getSocketId } from "../pusher/client";








//-----------------------------------------------DONE SECTION-----------------------------------------------/
// Create task
export function createTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, newTask } : { projectId: string, newTask: NewTask }) => {
      const socketId = getSocketId();
      return await createTaskAction(projectId, newTask, socketId || undefined);
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
    mutationFn: async ({ projectId, taskId, updTask } : { projectId: string, taskId: string; updTask: Partial<typeof tasks.$inferInsert> }) => {
      const socketId = getSocketId(); 
      return await updateTaskAction(projectId, taskId, updTask, socketId || undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-display"] });
    }
  });
}

// Delete task
export function deleteTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, taskId } : { projectId: string, taskId: string }) => {
      const socketId = getSocketId(); 
      return await deleteTaskAction(projectId, taskId, socketId || undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanban-display"] }) 
    }
  });
}
//-----------------------------------------------DONE SECTION-----------------------------------------------/