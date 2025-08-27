import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserImageAction } from "@/lib/clerk/user-image"
import * as Actions from "@/lib/db/actions"
import * as Schema from "@/lib/db/schema"

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

export function getUserId(clerkId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["users", clerkId],
    queryFn: async () => {
      const data = await Actions.getUserIdAction(clerkId);
      return data;
    },
    enabled: options?.enabled ?? !!clerkId
  });
}

export function KanbanUpdateTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, taskId, updTask } : 
      { projectId: string; taskId: string; updTask: Partial<typeof Schema.tasks.$inferInsert>; }) => {
      await Actions.KanbanUpdateTaskAction(projectId, taskId, updTask);
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
      { projectId: string; updProject: Partial<typeof Schema.projects.$inferInsert> }) => {
      await Actions.KanbanUpdateProjectAction(projectId, updProject);
    },
  });
}

export function KanbanDeleteTask(){
  return useMutation({
    mutationFn: async ({ projectId, taskId } : 
      { projectId: string; taskId: string; }) => {
      await Actions.KanbanDeleteTaskAction(projectId, taskId);
    },
  });
}

export function KanbanCreateTask(){
  return useMutation({
    mutationFn: async ({ projectId, newTask, assignees } : 
      { projectId: string; newTask: Schema.NewTask; assignees: string[]; }) => {
      await Actions.KanbanCreateTaskAction(projectId, newTask, assignees);
    }
  });
}

export function getUserProjects(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: async () => {
      const data = await Actions.getUserProjectsAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function getUserTasks(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["user-tasks", userId],
    queryFn: async () => {
      const data = await Actions.getUserTasksAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function getUserProjectsWithMembers(userId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["all-project-members", userId],
    queryFn: async () => {
      const data = await Actions.getUserProjectsWithMembersAction(userId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!userId
  });
}

export function getProjectData(projectId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["project-data", projectId],
    queryFn: async () => {
      const data = await Actions.getProjectDataAction(projectId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!projectId
  });
}

export function getTaskData(taskId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["task-data", taskId],
    queryFn: async () => {
      const data = await Actions.getTaskDataAction(taskId);
      return data ?? null;
    },
    enabled: options?.enabled ?? !!taskId
  });
}

export function getAllUsers(){
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const data = await Actions.getAllUsersAction();
      return data ?? null;
    }
  });
}

export function createProjectMember(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newProjectMember } : { newProjectMember: Schema.NewProjectMember }) => {
      await Actions.createProjectMemberAction(newProjectMember);
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
    mutationFn: async ({ pmId, updPm } : { pmId: string, updPm: Partial<typeof Schema.projectMembers.$inferInsert> }) => {
      await Actions.updateProjectMemberAction(pmId, updPm);
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
      await Actions.deleteProjectAction(projectId);
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
      await Actions.deleteProjectMemberAction(pmId);
      await Actions.deleteAllTaskAssigneeAction(projectId, userId);
      await Actions.deleteAllCommentAction(projectId, userId)
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
    mutationFn: async ({ newProject } : { newProject: Schema.NewProject }) => {
      const data = await Actions.createProjectAction(newProject);
      return data ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function createTaskAssignee(){
  return useMutation({
    mutationFn: async (newTaskAssignee: Schema.NewTaskAssignee) => {
      await Actions.createTaskAssigneeAction(newTaskAssignee);
    }
  });
}

export function deleteTaskAssignee(){
  return useMutation({
    mutationFn: async (taId: string) => {
      await Actions.deleteTaskAssigneeAction(taId);
    }
  });
}

export function createTask(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newTask } : { newTask: Schema.NewTask }) => {
      return await Actions.createTaskAction(newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function updateProject(userId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updProject } : { projectId: string; updProject: Partial<typeof Schema.projects.$inferInsert> }) => {
      return await Actions.updateProjectAction(projectId, updProject);
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
      await Actions.deleteProjectMemberAction(pmId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    }
  });
}

export function createComment(taskId: string){
  const queryClient = useQueryClient();
  return useMutation({ 
    mutationFn: async (newComment: Schema.NewComment) => {
      await Actions.createCommentAction(newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}

export function updateComment(taskId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cId, updComment } : { cId: string, updComment: Partial<typeof Schema.comments.$inferInsert> }) => {
      await Actions.updateCommentAction(cId, updComment);
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
      await Actions.deleteCommentAction(cId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}