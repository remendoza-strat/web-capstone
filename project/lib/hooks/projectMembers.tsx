import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectMemberAction, getAllUsersAction, getProjectMembersAction, getUserProjectsWithMembersAction } from "../db/actions";
import { NewProjectMember } from "../db/schema";
import { getUserImageAction } from "../clerk/user-image";

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
    queryKey: ["all-project-members", userId],
    queryFn: async () => {
      const data = await getUserProjectsWithMembersAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function getAllUsers(){
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const data = await getAllUsersAction();
      return data ?? null;
    }
  });
}

export function createProjectMember(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newProjectMember } : { newProjectMember: NewProjectMember }) => {
      return await createProjectMemberAction(newProjectMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-project-members"] });
    }
  });
}

export function getUserImage(clerkId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["member-icon", clerkId],
    queryFn: async () => {
      const data = await getUserImageAction(clerkId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!clerkId
  });
}