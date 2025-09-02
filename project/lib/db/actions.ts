"use server"
import { createQueries, deleteQueries, getQueries, updateQueries } from "@/lib/db/queries"
import type { NewProject, NewProjectMember, NewTask, NewTaskAssignee, NewComment, comments } from "@/lib/db/schema"
import { projects, taskAssignees, tasks, users } from "@/lib/db/schema"
import { db } from "@/lib/db/connection"
import { pusherServer } from "../pusher/server"
import { eq } from "drizzle-orm"
import { projectMembers } from './schema';
import { ServerCreateProjectMemberSchema, ServerCreateProjectSchema, ServerCreateTaskAssigneeSchema, ServerCreateTaskSchema, ServerUpdateProjectTimeSchema } from "../validations"
import { ClerkIdMatcher, UserAuthValidation, UserIdValidator, UserPermission, UserProjectMembership, UserTaskMembership, ValidProject, ValidProjectMember, ValidTask, ValidUser } from "./actions_validations"

/* ===================== GET ACTIONS ===================== */ 
export async function getUserIdAction(clerkId: string){

  // Validate clerkId
  const checkClerk = await ClerkIdMatcher(clerkId);
  if(!checkClerk.success){
    return { success: false, message: checkClerk.message };
  }

	// Return userId
  const userId = await getQueries.getUserId(clerkId);
  return { success: true, userId };

}

export async function getUserProjectsAction(userId: string){

  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

	// Return userProjects
  const userProjects = await getQueries.getUserProjects(userId);
	return { success: true, userProjects };

}

export async function getUserProjectsWithMembersAction(userId: string){
  
  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Return userProjectsMembers
  const userProjectsMembers = await getQueries.getUserProjectsWithMembers(userId);
  return { success: true, userProjectsMembers};

}

export async function getUserTasksAction(userId: string){
 
  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Return userTasks
  const userTasks = await getQueries.getUserTasks(userId);
  return { success: true, userTasks };
  
}

export async function getAllUsersAction(){

  // Validate user authentication
  const checkAuth = await UserAuthValidation();
  if(!checkAuth.success){
    return { success: false, message: checkAuth.message };
  }

  // Return allUsers
  const allUsers = await getQueries.getAllUsers();
  return { success: true, allUsers };

}

export async function getProjectDataAction(projectId: string, userId: string){

  // Validate project membership
  const checkUserProjMem = await UserProjectMembership(projectId, userId);
  if(!checkUserProjMem.success){
    return { success: false, message: checkUserProjMem.message };
  }
  
  // Return projectData
  const projectData = await getQueries.getProjectData(projectId);
  return { success : true, projectData };

}

export async function getTaskDataAction(taskId: string, userId: string){

  // Validate task project membership
  const checkTaskMem = await UserTaskMembership(taskId, userId);
  if(!checkTaskMem.success){
    return { success: false, message: checkTaskMem.message };
  }

  // Return taskData
  const taskData =  await getQueries.getTaskData(taskId);
  return { success : true, taskData };
}
/* ===================== GET ACTIONS ===================== */ 







export async function createProjectAction(newProject: NewProject){
  
  // Validate data
  const result = ServerCreateProjectSchema.safeParse({
    name: newProject.name,
    description: newProject.description,
    dueDate: newProject.dueDate,
    columnCount: newProject.columnCount,
    columnNames: newProject.columnNames
  });
  if(!result.success){
    return { success: false, message: result.error.issues[0].message };
  }

  // Validate user authentication
  const checkAuth = await UserAuthValidation();
  if(!checkAuth.success){
    return { success: false, message: checkAuth.message };
  }

  // Return projectId
  const projectId = await createQueries.createProject(newProject);
	return { success: true, projectId };

}

export async function createProjectMemberAction(newProjectMember: NewProjectMember){

  // Validate data
  const result = ServerCreateProjectMemberSchema.safeParse({
    projectId: newProjectMember.projectId,
    userId: newProjectMember.userId,
    role: newProjectMember.role,
    approved: newProjectMember.approved
  });
  if(!result.success){
    return { success: false, message: result.error.issues[0].message };
  }

  // Validate project
  const checkProject = await ValidProject(newProjectMember.projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate userId
  const checkUserId = await UserIdValidator(newProjectMember.userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Create project member
  await createQueries.createProjectMember(newProjectMember);
  return { success: true };

}

export async function addProjectMemberAction(newProjectMember: NewProjectMember, userId: string){

  // Validate data
  const result = ServerCreateProjectMemberSchema.safeParse({
    projectId: newProjectMember.projectId,
    userId: newProjectMember.userId,
    role: newProjectMember.role,
    approved: newProjectMember.approved
  });
  if(!result.success){
    return { success: false, message: result.error.issues[0].message };
  }

  // Validate project
  const checkProject = await ValidProject(newProjectMember.projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate user
  const checkUser = await ValidUser(newProjectMember.userId);
  if(!checkUser.success){
    return { success: false, message: checkUser.message };
  }

  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, newProjectMember.projectId, "addMember");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }

  // Create project member
  await createQueries.createProjectMember(newProjectMember);
  return { success: true };

}


export async function createTaskAction(newTask: NewTask, userId: string){

  // Validate data
  const result = ServerCreateTaskSchema.safeParse({
    projectId: newTask.projectId,
    title: newTask.title,
    description: newTask.description,
    dueDate: newTask.dueDate,
    priority: newTask.priority,
    position: newTask.position,
    order: newTask.order,
    label: newTask.label
  });
  if(!result.success){
    return { success: false, message: result.error.issues[0].message };
  }
  
    // Validate project
  const checkProject = await ValidProject(newTask.projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, newTask.projectId, "addTask");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }

  // Return taskId
  const taskId = await createQueries.createTask(newTask);
  return { success: true, taskId};
  
}

export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee, userId: string, projectId: string){
  
  // Validate data
  const result = ServerCreateTaskAssigneeSchema.safeParse({
    taskId: newTaskAssignee.taskId,
    userId: newTaskAssignee.userId
  });
  if(!result.success){
    return { success: false, message: result.error.issues[0].message };
  }

  // Validate task
  const checkTask = await ValidTask(newTaskAssignee.taskId);
  if(!checkTask.success){
    return { success: false, message: checkTask.message };
  }

  // Validate user
  const checkUser = await ValidUser(newTaskAssignee.userId);
  if(!checkUser.success){
    return { success: false, message: checkUser.message };
  }
  
  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, projectId, "addTask");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }

  // Create task assignee
  await createQueries.createTaskAssignee(newTaskAssignee);
  return { success: true };

}

export async function updateProjectTimeAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>){

  // Validate data
  const result = ServerUpdateProjectTimeSchema.safeParse({
    updatedAt: updProject.updatedAt
  });
  if(!result.success){
    return { success: false, message: result.error.issues[0].message };
  }

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate user authentication
  const checkAuth = await UserAuthValidation();
  if(!checkAuth.success){
    return { success: false, message: checkAuth.message };
  }
  
// Update project
await updateQueries.updateProject(projectId, updProject);
return {success: true};

}

export async function deleteProjectMemberAction(pmId: string){
  
  // Validate project member
  const checkMember = await ValidProjectMember(pmId);
  if(!checkMember.exist?.userId){
    return { success: false, message: checkMember.message };
  }

  // Validate userId
  const checkUserId = await UserIdValidator(checkMember.exist?.userId);
  if(!checkUserId.success){
    return { checkUserId: false, message: checkMember.message };
  }

  // Delete project member
  await deleteQueries.deleteProjectMember(pmId);
  return { success: true };

}

export async function updateProjectMemberAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>){

  // Validate project member
  const checkMember = await ValidProjectMember(pmId);
  if(!checkMember.exist?.userId){
    return { success: false, message: checkMember.message };
  }

  // Validate userId
  const checkUserId = await UserIdValidator(checkMember.exist?.userId);
  if(!checkUserId.success){
    return { checkUserId: false, message: checkMember.message };
  }

  // Accept invitation
  await updateQueries.updateProjectMember(pmId, updPm);
  return { success : true };

}



export async function updateMemberRoleAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>, userId: string){

  // Validate project member
  const checkMember = await ValidProjectMember(pmId);
  if(!checkMember.exist?.userId){
    return { success: false, message: checkMember.message };
  }

  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, checkMember.exist.projectId, "editMember");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }

  // Update role
  await updateQueries.updateProjectMember(pmId, updPm);
  return { success : true };

}

export async function deleteProjectAction(projectId: string, userId: string){
  
  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }
  
  // Validate userId
  const checkUserId = await UserIdValidator(userId);
  if(!checkUserId.success){
    return { success: false, message: checkUserId.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, projectId, "editProject");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }
  
  // Delete project
  await deleteQueries.deleteProject(projectId);
  return { success: true };

}

export async function kickMemberAction(pmId: string, projectId: string, memberId: string, userId: string){
  
  // Validate project member
  const checkMember = await ValidProjectMember(pmId);
  if(!checkMember.exist?.userId){
    return { success: false, message: checkMember.message };
  }

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate user
  const checkUser = await ValidUser(memberId);
  if(!checkUser.success){
    return { success: false, message: checkUser.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, projectId, "editMember");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }

  // Kick the user from project
  await deleteQueries.deleteProjectMember(pmId);
  await deleteQueries.deleteAllTaskAssignee(projectId, memberId);
  await deleteQueries.deleteAllComment(projectId, memberId)
  return { success: true }

}


export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>, userId: string){

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate user permission
  const checkPermission = await UserPermission(userId, projectId, "editProject");
  if(!checkPermission.success){
    return { success: false, message: checkPermission.message };
  }
  
  // Update project
  await updateQueries.updateProject(projectId, updProject);
  return {success: true};

}

export async function leaveProjectAction(pmId: string, projectId: string, memberId: string){
  
  // Validate project member
  const checkMember = await ValidProjectMember(pmId);
  if(!checkMember.exist?.userId){
    return { success: false, message: checkMember.message };
  }

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Validate user
  const checkUser = await ValidUser(memberId);
  if(!checkUser.success){
    return { success: false, message: checkUser.message };
  }

  // Leave the project
  await deleteQueries.deleteProjectMember(pmId);
  await deleteQueries.deleteAllTaskAssignee(projectId, memberId);
  await deleteQueries.deleteAllComment(projectId, memberId)
  return { success: true }

}




















// KANBAN ACTIONS
export async function KanbanUpdateProjectAction
  (projectId: string, updProject: Partial<typeof projects.$inferInsert>){

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Update the project
  const updatedProject = await db
    .update(projects)
    .set(updProject)
    .where(eq(projects.id, projectId))
    .returning();

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "project", project: updatedProject[0] }
  );

  // Return success
  return { success : true }

}

export async function KanbanCreateTaskAction
  (projectId: string, newTask: NewTask, assignees: string[]){

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }
  
  // Create task
  const [inserted] = await db
    .insert(tasks)
    .values(newTask)
    .returning({ id: tasks.id });

  // Create task assignees
  if(assignees.length > 0){
    await db.insert(taskAssignees).values(
      assignees.map((userId) => ({
        taskId: inserted.id,
        userId
      }))
    );
  }

  // Get full task info to return
  const fullTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, inserted.id),
    with: {assignees: {with: {user: true}}}
  });

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "update", task: fullTask }
  );

  // Return success
  return { success: true };

}

export async function KanbanUpdateTaskAction
  (projectId: string, taskId: string, updTask: Partial<typeof tasks.$inferInsert>){
    
  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Update the task
  await db.update(tasks).set({ ...updTask }).where(eq(tasks.id, taskId));

  // Get full task info to return
  const fullTask = await db.query.tasks.findFirst({ 
    where: eq(tasks.id, taskId),
    with: {assignees: {with: {user: true}}}
  });

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "update", task: fullTask }
  );

  // Return success
  return { success : true }

}

export async function KanbanDeleteTaskAction
  (projectId: string, taskId: string){

  // Validate project
  const checkProject = await ValidProject(projectId);
  if(!checkProject.success){
    return { success: false, message: checkProject.message };
  }

  // Delete the task
  await db.delete(tasks).where(eq(tasks.id, taskId));

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "delete", taskId }
  );

  // Return success
  return { success : true }

}

export async function KanbanCreateAssigneeAction(newTaskAssignee: NewTaskAssignee){

  if (!newTaskAssignee) return { success : false, message: "error" }

  await createQueries.createTaskAssignee(newTaskAssignee);

  // Return success
  return { success : true }

}

export async function KanbanDeleteAssigneeAction(taId: string){

  if (!taId) return { success : false, message: "error" }

  await deleteQueries.deleteTaskAssignee(taId);

  // Return success
  return { success : true }

}

export async function createCommentAction(newComment: NewComment){
  await createQueries.createComment(newComment);
}

export async function deleteCommentAction(cId: string){
  await deleteQueries.deleteComment(cId);
}

export async function updateCommentAction(cId: string, updComment: Partial<typeof comments.$inferInsert>){
  await updateQueries.updateComment(cId, updComment);
}

