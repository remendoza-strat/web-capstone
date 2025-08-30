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
import { ServerCreateProjectMemberSchema, ServerCreateProjectSchema } from "../validations"






export async function getUserIdAction(clerkId: string){

	// Get clerkId of current user
  const { userId: currentId } = await auth();

	// Check if current user clerkId and passed clerkId matches
  if(currentId !== clerkId){
    return { success: false, message: "Unauthorized action." };
  }

	// Return userId
  const userId = await getQueries.getUserId(clerkId);
  return { success: true, userId };

}

export async function getUserProjectsAction(userId: string){

  // Check format of userId
  if(!isUuid(userId)){
    return { success: false, message: "Invalid id." };
  }

	// Try to get clerkId with userId
  const clerkId = await getQueries.getClerkId(userId);
  if(!clerkId){
    return { success: false, message: "User not found." };
  }

	// Get clerkId of current user
  const { userId: currentId } = await auth();

	// Check if clerkId of passed userId matches current clerkId
	if(currentId !== clerkId){
    return { success: false, message: "Unauthorized action." };
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

  // Get clerkId of current user
  const { userId: currentId } = await auth();

	// Check authenticated
	if(!currentId){
    return { success: false, message: "Unauthorized action." };
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

  // Check if user exist
  const userExist = await getQueries.getClerkId(newProjectMember.userId);
  if(!userExist){
    return { success: false, message: "User not found." };
  }

  // Check if project exist
  const projectExist = await getQueries.getProjectData(newProjectMember.projectId);
  if(!projectExist){
    return { success: false, message: "Project not found." };
  }

  // Create project member
  await createQueries.createProjectMember(newProjectMember);
  return { success: true };

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

// GET ACTIONS
export async function getUserProjectsWithMembersAction(userId: string){
  return await getQueries.getUserProjectsWithMembers(userId);
}
export async function getAllUsersAction(){
  return await getQueries.getAllUsers();
}
export async function getProjectDataAction(projectId: string){
  return await getQueries.getProjectData(projectId);
}
export async function getTaskDataAction(taskId: string){
  return await getQueries.getTaskData(taskId);
}
export async function getUserTasksAction(userId: string){
  return await getQueries.getUserTasks(userId);
}

// CREATE ACTIONS
export async function createUserAction(newUser: NewUser){
  return await createQueries.createUser(newUser);
}

export async function createTaskAction(newTask: NewTask){
  return await createQueries.createTask(newTask);
}
export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee){
  await createQueries.createTaskAssignee(newTaskAssignee);
}

export async function createCommentAction(newComment: NewComment){
  await createQueries.createComment(newComment);
}

// UPDATE ACTIONS
export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>){
  await updateQueries.updateProject(projectId, updProject);
}
export async function updateProjectMemberAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>){
  await updateQueries.updateProjectMember(pmId, updPm);
}
export async function updateCommentAction(cId: string, updComment: Partial<typeof comments.$inferInsert>){
  await updateQueries.updateComment(cId, updComment);
}
export async function updateUserAction(clerkId: string, updUser: Partial<typeof users.$inferInsert>){
  await updateQueries.updateUser(clerkId, updUser);
}

// DELETE ACTIONS
export async function deleteProjectAction(projectId: string){
  await deleteQueries.deleteProject(projectId);
}
export async function deleteProjectMemberAction(pmId: string){
  await deleteQueries.deleteProjectMember(pmId);
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