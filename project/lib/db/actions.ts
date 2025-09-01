"use server"
import { createQueries, deleteQueries, getQueries, updateQueries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee, NewComment, comments } from "@/lib/db/schema"
import { projects, taskAssignees, tasks, users } from "@/lib/db/schema"
import { db } from "@/lib/db/connection"
import { pusherServer } from "../pusher/server"
import { eq } from "drizzle-orm"
import { projectMembers } from './schema';
import { auth } from "@clerk/nextjs/server"
import { validate as isUuid } from "uuid"
import { ServerCreateProjectMemberSchema, ServerCreateProjectSchema, ServerCreateTaskAssigneeSchema, ServerCreateTaskSchema, ServerUpdateProjectTimeSchema } from "../validations"
import { hasPermission, Permissions } from "../permissions"





// Checking for:
// is parameter clerkId === current clerkId?
export async function ClerkIdMatcher(clerkId: string){

  // Get clerkId of current user
  const { userId: currentId } = await auth();

	// Check if current user clerkId and passed clerkId matches
  if(currentId !== clerkId){
    return { success: false, message: "Unauthorized action." };
  }

  // Return true
  return {success: true};

}

// Checking for:
// is userId format correct?
// does userId's clerkId exist in db?
// ClerkIdMatcher()
export async function UserIdValidator(userId: string){

  // Check format of userId
  if(!isUuid(userId)){
    return { success: false, message: "Invalid ID." };
  }

	// Try to get clerkId with userId
  const clerkId = await getQueries.getClerkId(userId);
  if(!clerkId){
    return { success: false, message: "User not found." };
  }

  // Validate clerkId
  const checkClerk = await ClerkIdMatcher(clerkId);
  if(!checkClerk.success){
    return { success: false, message: checkClerk.message };
  }

  // Return true
  return { success: true };

}

// Checking for:
// is user authenticated?
export async function UserAuthValidation(){

  // Get clerkId of current user
  const { userId: currentId } = await auth();

	// Check if authenticated
	if(!currentId){
    return { success: false, message: "Unauthorized action." };
  }

  // Return true
  return { success: true};

}

// Checking for:
// is projectId format correct?
// does the project exist?
export async function ValidProject(projectId: string){
  
  // Check projectId format
   if(!isUuid(projectId)){
    return { success: false, message: "Invalid ID." };
  }

  // Check if project exist
  const exist = await getQueries.getProject(projectId);
  if(!exist){
    return { success: false, message: "Project not found." };
  }

  // Return true
  return { success: true };

}

// Checking for:
// is taskId format correct?
// does the task exist?
export async function ValidTask(taskId: string){
  
  // Check taskId format
   if(!isUuid(taskId)){
    return { success: false, message: "Invalid ID." };
  }

  // Check if task exist
  const exist = await getQueries.getTask(taskId);
  if(!exist){
    return { success: false, message: "Task not found." };
  }

  // Return true
  return { success: true };

}

// Checking for:
// is pmId format correct?
// does the project member exist?
export async function ValidProjecMember(pmId: string){
  
  // Check pmId format
   if(!isUuid(pmId)){
    return { success: false, message: "Invalid ID." };
  }

  // Check if project member exist
  const exist = await getQueries.getProjectMember(pmId);
  if(!exist){
    return { success: false, message: "Project member not found." };
  }

  // Return true
  return { success: true, exist };

}

// Checking for:
// is userId format correct?
// does the user exist?
export async function ValidUser(userId: string){

  // Check userId format
  if(!isUuid(userId)){
    return { success: false, message: "Invalid ID." };
  }
  
  // Check if user exist
  const exist = await getQueries.getClerkId(userId);
  if(!exist){
    return { success: false, message: "User not found." };
  }

  // Return true
  return {success: true};
}

// Checking for:
// are ids formar correct?
// can user perform the action?
export async function UserPermission(userId: string, projectId: string, action: keyof Permissions){

  // Check formats
  if(!isUuid(userId) || !isUuid(projectId)){
    return { success: false, message: "Invalid ID." };
  }
  
  // Validate user permission
  const getUser = await getQueries.getMember(userId, projectId);
  if(!getUser || !hasPermission(getUser.role, action)){
    return { success: false, message: "Unauthorized action." }; 
  }

  // Return true
  return {success: true};

}





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
  const checkMember = await ValidProjecMember(pmId);
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
  const checkMember = await ValidProjecMember(pmId);
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

export async function updateMemberRoleAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>, userId: string){

  // Validate project member
  const checkMember = await ValidProjecMember(pmId);
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
  const checkMember = await ValidProjecMember(pmId);
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






// KANBAN ACTIONS
export async function KanbanUpdateTaskAction
  (projectId: string, taskId: string, updTask: Partial<typeof tasks.$inferInsert>){
    
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
}
export async function KanbanUpdateProjectAction
  (projectId: string, updProject: Partial<typeof projects.$inferInsert>){
    
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
}
export async function KanbanDeleteTaskAction
  (projectId: string, taskId: string){

  // Delete the task
  await db.delete(tasks).where(eq(tasks.id, taskId));

  // Broadcast
  await pusherServer.trigger(
    `kanban-channel-${projectId}`,
    "kanban-update",
    { action: "delete", taskId }
  );
}
export async function KanbanCreateTaskAction
  (projectId: string, newTask: NewTask, assignees: string[]){
  
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
}
export async function getProjectDataAction(projectId: string){
  return await getQueries.getProjectData(projectId);
}
export async function getTaskDataAction(taskId: string){
  return await getQueries.getTaskData(taskId);
}
export async function createUserAction(newUser: NewUser){
  return await createQueries.createUser(newUser);
}
export async function createCommentAction(newComment: NewComment){
  await createQueries.createComment(newComment);
}
export async function updateCommentAction(cId: string, updComment: Partial<typeof comments.$inferInsert>){
  await updateQueries.updateComment(cId, updComment);
}
export async function updateUserAction(clerkId: string, updUser: Partial<typeof users.$inferInsert>){
  await updateQueries.updateUser(clerkId, updUser);
}
export async function deleteTaskAssigneeAction(taId: string){
  await deleteQueries.deleteTaskAssignee(taId);
}
export async function deleteCommentAction(cId: string){
  await deleteQueries.deleteComment(cId);
}
export async function deleteUserAction(clerkId: string){
  await deleteQueries.deleteUser(clerkId);
}
export async function deleteAllTaskAssigneeAction(projectId: string, userId: string){
  await deleteQueries.deleteAllTaskAssignee(projectId, userId);
}
export async function deleteAllCommentAction(projectId: string, userId: string){
  await deleteQueries.deleteAllComment(projectId, userId);
}