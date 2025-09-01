import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserImageAction } from "@/lib/clerk/user-image"
import * as Actions from "@/lib/db/actions"
import * as Schema from "@/lib/db/schema"





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
    mutationFn: async ({ newTaskAssignee, userId, projectId } : { newTaskAssignee: Schema.NewTaskAssignee, userId: string, projectId: string })  => {
      const result = await Actions.createTaskAssigneeAction(newTaskAssignee, userId, projectId);
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

export function deleteProjectMember(){
  return useMutation({
    mutationFn: async ({ pmId } : { pmId: string }) => {
      const result = await Actions.deleteProjectMemberAction(pmId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function updateProjectMember(){
  return useMutation({
    mutationFn: async ({ pmId, updPm } : { pmId: string, updPm: Partial<typeof Schema.projectMembers.$inferInsert> }) => {
      const result = await Actions.updateProjectMemberAction(pmId, updPm);
      if(!result.success){
        throw { message: result.message };
      }
    }
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

export function updateMemberRole(){
  return useMutation({
    mutationFn: async ({ pmId, updPm, userId } : { pmId: string, updPm: Partial<typeof Schema.projectMembers.$inferInsert>, userId: string }) => {
      const result = await Actions.updateMemberRoleAction(pmId, updPm, userId);
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

export function kickMember(){
  return useMutation({
    mutationFn: async ({ pmId, projectId, memberId, userId } : { pmId: string, projectId: string, memberId: string, userId: string }) => {
      const result = await Actions.kickMemberAction(pmId, projectId, memberId, userId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}

export function getProjectData(projectId: string, options: { enabled: boolean }){
  return useQuery({
    queryKey: ["project-data", projectId],
    queryFn: async () => {
      const result = await Actions.getProjectDataAction(projectId);
      if(!result.success){
        throw { message: result.message };
      }
      return result.projectData;
    },
    enabled: options.enabled
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
    mutationFn: async ({ pmId, projectId, memberId } : { pmId: string, projectId: string, memberId: string }) => {
      const result = await Actions.leaveProjectAction(pmId, projectId, memberId);
      if(!result.success){
        throw { message: result.message };
      }
    }
  });
}





// KANBAN QUERIES
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








export function deleteTaskAssignee(){
  return useMutation({
    mutationFn: async (taId: string) => {
      await Actions.deleteTaskAssigneeAction(taId);
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