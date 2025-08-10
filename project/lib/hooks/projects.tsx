import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import  { getProjectByIdAction, deleteProjectAction } from "@/lib/db/actions"


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