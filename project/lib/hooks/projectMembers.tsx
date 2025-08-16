import { useQuery } from "@tanstack/react-query";
import { getProjectMembersAction, getUserProjectsWithMembersAction } from "../db/actions";
import { getUserImageAction } from "@/lib/clerk/image";

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
















export function getUserProjectsWithMembers(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["all-project-members"],
    queryFn: async () => {
      const data = await getUserProjectsWithMembersAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function useUserImage(clerkId: string, enabled = true) {
  return useQuery({
    queryKey: ["member-icon"],
    queryFn: async () => {
      const data = await getUserImageAction(clerkId);
      return data ?? null;
    },
    enabled: enabled && !!clerkId,
  });
}