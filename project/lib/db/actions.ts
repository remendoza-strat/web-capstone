"use server"
import { createQueries, deleteQueries, getQueries, queries, updateQueries } from "@/lib/db/queries"
import type { NewUser, NewProject, NewProjectMember, NewTask, NewTaskAssignee } from "@/lib/db/schema"
import { projects, tasks } from "@/lib/db/schema"
import { db } from "@/lib/db/connection"
import { pusherServer } from "../pusher/server"
import { eq } from "drizzle-orm"
import { projectMembers } from './schema';


// Return = users
// that is not a member of the project or not yet invited
export async function getNonProjectMembersAction(projectId: string){
  return await queries.projectMembers.getNonProjectMembers(projectId);
}

// Return = tasks
// of the given userId
export async function getUserTasksAction(userId: string){
  return await queries.tasks.getUserTasks(userId);
}

// Create user
export async function createUserAction(newUser: NewUser){
  return await queries.users.createUser(newUser);
}


// Update = "updatedAt"
// of given projectId
export async function updateProjectTimeAction(projectId: string){
  await queries.projects.updateProjectTime(projectId);
}

// Requires: clerk id
// Return: user id
export async function getUserIdAction(clerkId: string){
  return await queries.users.getUserId(clerkId);
}


// Require: project id
// Return: project with tasks
export async function getProjectWithTasksAction(projectId: string){
  return await queries.projects.getProjectWithTasks(projectId);
}

// Require: project id
// Return: project data
export async function getProjectAction(projectId: string){
  return await queries.projects.getProject(projectId);
}

// Require: project id
// Return: project members
export async function getProjectMembersAction(projectId: string){
  return await queries.projectMembers.getProjectMembers(projectId);
}

// Delete task
export async function deleteTaskAction(projectId: string, taskId: string, socketId?: string){
  const [result] = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  if(result){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "task-update", { task: result },
      socketId ? { socket_id: socketId } : undefined
    );
  }
}


















// Require: user id
// Result: user projects with its members (approved && not)
export async function getUserProjectsWithMembersAction(userId: string){
  return await getQueries.getUserProjectsWithMembers(userId);
}

// Require: NONE
// Result: all users
export async function getAllUsersAction(){
  return await getQueries.getAllUsers();
}

// Require: project member
// Result: NONE
export async function createProjectMemberAction(newProjectMember: NewProjectMember){
  await createQueries.createProjectMember(newProjectMember);
}

// Require: project member id & project member
// Result: NONE
export async function updateProjectMemberAction(pmId: string, updPm: Partial<typeof projectMembers.$inferInsert>){
  await updateQueries.updateProjectMember(pmId, updPm);
}

// Require: project id
// Result: NONE
export async function deleteProjectAction(projectId: string){
  await deleteQueries.deleteProject(projectId);
}

// Require: project member id
// Result: NONE
export async function deleteProjectMemberAction(pmId: string){
  await deleteQueries.deleteProjectMember(pmId);
}

// Require: project id & user id
// Result: NONE
export async function deleteTaskAssigneeAction(projectId: string, userId: string){
  await deleteQueries.deleteTaskAssignee(projectId, userId);
}

// Require: project id & user id
// Result: NONE
export async function deleteCommentAction(projectId: string, userId: string){
  await deleteQueries.deleteComment(projectId, userId);
}

// Require: user id
// Result: user projects and invited projects with its tasks and members
export async function getUserProjectsAction(userId: string){
  return await getQueries.getUserProjects(userId);
}

// Require: new project
// Result: new project id
export async function createProjectAction(newProject: NewProject){
  return await createQueries.createProject(newProject);
}

// Require: new task
// Result: NONE
export async function createTaskAssigneeAction(newTaskAssignee: NewTaskAssignee){
  await createQueries.createTaskAssignee(newTaskAssignee);
}

// Require: project id
// Result: project with members and tasks with assignees
export async function getProjectDataAction(projectId: string){
  return await getQueries.getProjectData(projectId);
}














// Tanstack - Pusher - Query
// Create Task
export async function createTaskAction(projectId: string, newTask: NewTask, socketId?: string){
  const [result] = await db.insert(tasks).values(newTask).returning({ id: tasks.id });
  if(result.id){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "task-update", { task: { ...newTask, id: result.id } },
      socketId ? { socket_id: socketId } : undefined
    );
  }
  return result.id;
}

// Tanstack - Pusher - Query
// Update Project
export async function updateProjectAction(projectId: string, updProject: Partial<typeof projects.$inferInsert>, socketId?: string){
  const [result] = await db.update(projects).set({...updProject}).where(eq(projects.id, projectId)).returning();
  if(result){
    await pusherServer.trigger(`kanban-channel-${projectId}`, "project-update", { project: result },
      socketId ? { socket_id: socketId } : undefined
    );
  }
}


export async function updateTaskAction(
  projectId: string,
  taskId: string,
  updTask: Partial<typeof tasks.$inferInsert>,
  socketId?: string
) {
  // Update task row
  await db.update(tasks)
    .set({ ...updTask })
    .where(eq(tasks.id, taskId));


  const fullTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      assignees: {
        with: {
          user: true,
        },
      },
    },
  });

  if (fullTask) {
   
    await pusherServer.trigger(
      `kanban-channel-${projectId}`,
      "kanban-update",
      { task: fullTask },
      socketId ? { socket_id: socketId } : undefined
    );
  }

  return fullTask; 
}