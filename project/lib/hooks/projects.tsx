import { useQuery } from "@tanstack/react-query"
import  { getProjectByIdAction } from "@/lib/db/actions"

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