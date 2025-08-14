import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import  { getProjectDataAction, deleteProjectAction, updateProjectAction, getProjectAction, getProjectWithTasksAction } from "@/lib/db/actions"
import { projects } from "@/lib/db/schema"

// Uses deleteProjectAction()
export function deleteProject(){
  return useMutation({
    mutationFn: async (projectId: string) => {
      await deleteProjectAction(projectId);
    }
  });
}

// Uses updateProjectAction()
export function updateProject(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updProject } : { projectId: string; updProject: Partial<typeof projects.$inferInsert> }) => {
      await updateProjectAction(projectId, updProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["kanban-display"] });
    }
  });
}

// Uses getProjectAction()
export function getProject(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const data = await getProjectAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}

// Uses getProjectDataAction()
export function getProjectData(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await getProjectDataAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}

// Uses getProjectAction()
export function getProjectWithTasks(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["kanban-display"],
    queryFn: async () => {
      const data = await getProjectWithTasksAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}
