import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import  { getProjectByIdAction, deleteProjectAction, updateProjectAction } from "@/lib/db/actions"
import { projects } from "@/lib/db/schema"


// Uses getProjectByIdAction()
export function getProjectById(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const data = await getProjectByIdAction(projectId);
      return data;
    },
    enabled: options?.enabled ?? !!projectId
  });
}

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
    mutationFn: async ({ projectId, updProject }: { projectId: string; updProject: Partial<typeof projects.$inferInsert> }) => {
      await updateProjectAction(projectId, updProject);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
    }
  });
}