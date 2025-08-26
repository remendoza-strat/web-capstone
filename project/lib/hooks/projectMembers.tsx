import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectAction, createProjectMemberAction, createTaskAction, createTaskAssigneeAction, deleteAllCommentAction, deleteProjectAction, deleteProjectMemberAction, deleteAllTaskAssigneeAction, getAllUsersAction, 
 getUserProjectsAction, getUserProjectsWithMembersAction, updateProjectAction, updateProjectMemberAction, getProjectDataAction, KanbanUpdateTaskAction, 
 KanbanUpdateProjectAction, KanbanDeleteTaskAction,
 KanbanCreateTaskAction,
 getTaskDataAction,
 KanbanDeleteTaskAssigneeAction,
 createCommentAction,
 updateCommentAction,
 deleteCommentAction} from "../db/actions";
import { comments, NewComment, NewProject, NewProjectMember, NewTask, NewTaskAssignee, projectMembers, projects, tasks } from "../db/schema";
import { getUserImageAction } from "../clerk/user-image";
import { getSocketId } from "../pusher/client";

export function KanbanUpdateTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, taskId, updTask } : 
      { projectId: string; taskId: string; updTask: Partial<typeof tasks.$inferInsert>; }) => {
      await KanbanUpdateTaskAction(projectId, taskId, updTask);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["task-data", vars.taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-data", vars.projectId] });
    }
  });
}

export function KanbanUpdateProject(){
  return useMutation({
    mutationFn: async ({ projectId, updProject } : 
      { projectId: string; updProject: Partial<typeof projects.$inferInsert> }) => {
      await KanbanUpdateProjectAction(projectId, updProject);
    },
  });
}

export function KanbanDeleteTask(){
  return useMutation({
    mutationFn: async ({ projectId, taskId } : 
      { projectId: string; taskId: string; }) => {
      await KanbanDeleteTaskAction(projectId, taskId);
    },
  });
}

export function KanbanCreateTask(){
  return useMutation({
    mutationFn: async ({ projectId, newTask, assignees } : 
      { projectId: string; newTask: NewTask; assignees: string[]; }) => {
      await KanbanCreateTaskAction(projectId, newTask, assignees);
    }
  });
}

export function KanbanDeleteTaskAssignee(){
  return useMutation({
    mutationFn: async (taId: string) => {
      await KanbanDeleteTaskAssigneeAction(taId);
    }
  });
}

export function getUserProjects(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: async () => {
      const data = await getUserProjectsAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
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

export function getProjectData(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["project-data", projectId],
    queryFn: async () => {
      const data = await getProjectDataAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}

export function getTaskData(taskId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["task-data", taskId],
    queryFn: async () => {
      const data = await getTaskDataAction(taskId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!taskId
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

export function getAllUsers(){
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const data = await getAllUsersAction();
      return data ?? null;
    }
  });
}

export function createProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newProjectMember } : { newProjectMember: NewProjectMember }) => {
      await createProjectMemberAction(newProjectMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function updateProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pmId, updPm } : { pmId: string, updPm: Partial<typeof projectMembers.$inferInsert> }) => {
      await updateProjectMemberAction(pmId, updPm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function deleteProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId } : { projectId: string }) => {
      await deleteProjectAction(projectId);
    },
    onSuccess: (_, vars) => {
      queryClient.setQueryData(["user-projects", userId], (old: any) => {
        if (!old) return old;
        return old.filter((p: any) => p.id !== vars.projectId);
      });
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function kickMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pmId, projectId, userId } : { pmId: string, projectId: string, userId: string }) => {
      await deleteProjectMemberAction(pmId);
      await deleteAllTaskAssigneeAction(projectId, userId);
      await deleteAllCommentAction(projectId, userId)
    },
    onSuccess: (_, vars) => {
      queryClient.setQueryData(["user-projects", userId], (old: any) => {
        if (!old) return old;
        return old.filter((p: any) => p.id !== vars.projectId);
      });
      queryClient.invalidateQueries({ queryKey: ["all-project-members", userId] });
    }
  });
}

export function createProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newProject } : { newProject: NewProject }) => {
      const data = await createProjectAction(newProject);
      return data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function createTaskAssignee(){
  return useMutation({
    mutationFn: async (newTaskAssignee: NewTaskAssignee) => {
      await createTaskAssigneeAction(newTaskAssignee);
    }
  });
}

export function createTask(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newTask } : { newTask: NewTask }) => {
      return await createTaskAction(newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function updateProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updProject } : { projectId: string; updProject: Partial<typeof projects.$inferInsert> }) => {
      return await updateProjectAction(projectId, updProject);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
      queryClient.invalidateQueries({ queryKey: ["project-data", vars.projectId] });
    }
  });
}

export function deleteProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pmId } : { pmId: string }) => {
      await deleteProjectMemberAction(pmId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function createComment(taskId: string){
  const queryClient = useQueryClient();
  return useMutation({ 
    mutationFn: async (newComment: NewComment) => {
      await createCommentAction(newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}

export function updateComment(taskId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cId, updComment } : { cId: string, updComment: Partial<typeof comments.$inferInsert> }) => {
      await updateCommentAction(cId, updComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}

export function deleteComment(taskId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cId } : { cId: string }) => {
      await deleteCommentAction(cId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}