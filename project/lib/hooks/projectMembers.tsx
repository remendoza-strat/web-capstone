import { useQuery } from "@tanstack/react-query";
import { getProjectMembersAction } from "../db/actions";

// Uses getProjectMembers()
export function getProjectMembers(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["project-members"],
    queryFn: async () => {
      const data = await getProjectMembersAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}