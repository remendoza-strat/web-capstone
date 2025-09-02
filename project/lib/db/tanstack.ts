import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserImageAction } from "@/lib/clerk/user-image"
import * as Actions from "@/lib/db/actions"
import * as Schema from "@/lib/db/schema"

/* ================ MAIN QUERIES ================ */
export function getUserId(clerkId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["user-id", clerkId],
    queryFn: async () => {
      const result = await Actions.getUserIdAction(clerkId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.userId;
    },
    enabled: options.enabled
  });
}

export function getUserProjects(userId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: async () => {
      const result = await Actions.getUserProjectsAction(userId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.userProjects;
    },
    enabled: options.enabled
  });
}

export function getUserProjectsWithMembers(userId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["project-members", userId],
    queryFn: async () => {
      const result = await Actions.getUserProjectsWithMembersAction(userId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.userProjectsMembers;
    },
    enabled: options.enabled
  });
}

export function getUserTasks(userId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["user-tasks", userId],
    queryFn: async () => {
      const result = await Actions.getUserTasksAction(userId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.userTasks;
    },
    enabled: options.enabled
  });
}

export function getAllUsers(){
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const result = await Actions.getAllUsersAction();
      if(!result.success){
        throw { message: result.message };
      }
      return result.allUsers;
    }
  });
}

export function getProjectData(projectId: string, userId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["project-data", projectId],
    queryFn: async () => {
      const result = await Actions.getProjectDataAction(projectId, userId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.projectData;
    },
    enabled: options.enabled
  });
}

export function getTaskData(taskId: string, userId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["task-data", taskId],
    queryFn: async () => {
      const result = await Actions.getTaskDataAction(taskId, userId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.taskData;
    },
    enabled: options.enabled
  });
}

export function createProject(){
  return useMutation({
    mutationFn: async ({ newProject } : { newProject: Schema.NewProject }) => {
      const result = await Actions.createProjectAction(newProject);
      if(!result.success){
        throw { message: result.message };
      }
      return result.projectId;
    }
  });
}

export function createProjectMember(){
  return useMutation({
    mutationFn: async ({ newProjectMember } : { newProjectMember: Schema.NewProjectMember }) => {
      const result = await Actions.createProjectMemberAction(newProjectMember);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function addProjectMember(){
  return useMutation({
    mutationFn: async ({ newProjectMember, userId } : { newProjectMember: Schema.NewProjectMember, userId: string }) => {
      const result = await Actions.addProjectMemberAction(newProjectMember, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function createTask(){
  return useMutation({
    mutationFn: async ({ newTask, userId } : { newTask: Schema.NewTask, userId: string }) => {
      const result = await Actions.createTaskAction(newTask, userId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.taskId;
    }
  });
}

export function createTaskAssignee(){
  return useMutation({
    mutationFn: async ({ newTaskAssignee, userId } : { newTaskAssignee: Schema.NewTaskAssignee, userId: string })  => {
      const result = await Actions.createTaskAssigneeAction(newTaskAssignee, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function updateProjectTime(){
  return useMutation({
    mutationFn: async ({ projectId, updProject } : { projectId: string; updProject: Partial<typeof Schema.projects.$inferInsert> }) => {
      const result = await Actions.updateProjectTimeAction(projectId, updProject);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function updateProjectMember(){
  return useMutation({
    mutationFn: async ({ projectMemberId, updProjectMember } : { projectMemberId: string, updProjectMember: Partial<typeof Schema.projectMembers.$inferInsert> }) => {
      const result = await Actions.updateProjectMemberAction(projectMemberId, updProjectMember);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function deleteProjectMember(){
  return useMutation({
    mutationFn: async ({ projectMemberId } : { projectMemberId: string }) => {
      const result = await Actions.deleteProjectMemberAction(projectMemberId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function deleteProject(){
  return useMutation({
    mutationFn: async ({ projectId, userId } : { projectId: string, userId: string }) => {
      const result = await Actions.deleteProjectAction(projectId, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function updateMemberRole(){
  return useMutation({
    mutationFn: async ({ projectMemberId, updProjectMember, userId } : { projectMemberId: string, updProjectMember: Partial<typeof Schema.projectMembers.$inferInsert>, userId: string }) => {
      const result = await Actions.updateMemberRoleAction(projectMemberId, updProjectMember, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function updateProject(){
  return useMutation({
    mutationFn: async ({ projectId, updProject, userId } : { projectId: string; updProject: Partial<typeof Schema.projects.$inferInsert>; userId: string }) => {
      const result = await Actions.updateProjectAction(projectId, updProject, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function leaveProject(){
  return useMutation({
    mutationFn: async ({ projectMemberId, projectId, userId } : { projectMemberId: string, projectId: string, userId: string }) => {
      const result = await Actions.leaveProjectAction(projectMemberId, projectId, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function kickMember(){
  return useMutation({
    mutationFn: async ({ projectMemberId, projectId, memberUserId, userId } : { projectMemberId: string, projectId: string, memberUserId: string, userId: string }) => {
      const result = await Actions.kickMemberAction(projectMemberId, projectId, memberUserId, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}
/* ================ MAIN QUERIES ================ */

/* ================ KANBAN QUERIES ================ */
export function KanbanUpdateProject(){
  return useMutation({
    mutationFn: async ({ projectId, updProject } : 
      { projectId: string; updProject: Partial<typeof Schema.projects.$inferInsert> }) => {
      const result = await Actions.KanbanUpdateProjectAction(projectId, updProject);
      if(!result.success){
        throw { message: result.message };
      }
    },
  });
}

export function KanbanCreateTask(){
  return useMutation({
    mutationFn: async ({ projectId, newTask, assignees } : 
      { projectId: string; newTask: Schema.NewTask; assignees: string[]; }) => {
      const result = await Actions.KanbanCreateTaskAction(projectId, newTask, assignees);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function KanbanUpdateTask(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, taskId, updTask } : 
      { projectId: string; taskId: string; updTask: Partial<typeof Schema.tasks.$inferInsert>; }) => {
      const result = await Actions.KanbanUpdateTaskAction(projectId, taskId, updTask);
      if(!result.success){
        throw { message: result.message };
      }
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["project-data", vars.projectId] });
    }
  });
}

export function KanbanDeleteTask(){
  return useMutation({
    mutationFn: async ({ projectId, taskId } : 
      { projectId: string; taskId: string; }) => {
      const result = await Actions.KanbanDeleteTaskAction(projectId, taskId);
      if(!result.success){
        throw { message: result.message };
      }
    },
  });
}

export function KanbanCreateAssignee(){
  return useMutation({
    mutationFn: async (newTaskAssignee: Schema.NewTaskAssignee) => {
      const result = await Actions.KanbanCreateAssigneeAction(newTaskAssignee);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function KanbanDeleteAssignee(){
  return useMutation({
    mutationFn: async (taskAssigneeId: string) => {
      const result = await Actions.KanbanDeleteAssigneeAction(taskAssigneeId);
      if(!result.success){
        throw { message: result.message };
      }
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
    mutationFn: async ({ commentId, updComment } : { commentId: string, updComment: Partial<typeof Schema.comments.$inferInsert> }) => {
      await Actions.updateCommentAction(commentId, updComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}

export function deleteComment(taskId: string){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await Actions.deleteCommentAction(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-data", taskId] });
    }
  });
}
/* ================ KANBAN QUERIES ================ */

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