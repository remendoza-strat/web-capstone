"use server"
import { auth } from "@clerk/nextjs/server"
import { validate as isUuid } from "uuid"
import { checkQueries } from "@/lib/db/queries"
import { hasPermission, Permissions } from "@/lib/permissions"

// Function:
// is paramClerkId === currentClerkId?
export async function ClerkIdMatcher(paramClerkId: string){

	// Get clerkId of current user
  const { userId: currentClerkId } = await auth();

	// Check if clerkId of current user matches clerkId in parameter
  if(currentClerkId !== paramClerkId){
    return { success: false, message: "Unauthorized action." };
  }

	// Return success
  return {success: true};

}

// Function:
// is user authenticated?
export async function UserAuthValidation(){

	// Get clerkId of current user
  const { userId: currentClerkId } = await auth();

	// Check if user is authenticated
  if(!currentClerkId){
    return { success: false, message: "Unauthorized action." };
  }

	// Return success
  return { success: true};

}

// Function:
// is userId format correct?
// does userId have equivalent clerkId?
// ClerkIdMatcher()
export async function UserIdValidator(userId: string){

	// Check format
  if(!isUuid(userId)){
    return { success: false, message: "Invalid ID." };
  }

	// Get the equivalent clerkId
  const result = await checkQueries.getUser(userId);
	const clerkId = result?.clerkId;
  if(!clerkId){
    return { success: false, message: "User not found." };
  }

	// Check if clerkId matches with current user
  const checkClerk = await ClerkIdMatcher(clerkId);
  if(!checkClerk.success){
    return { success: false, message: checkClerk.message };
  }

	// Return success
  return { success: true };

}

// Function:
// is userId format correct?
// does userId exist in db?
export async function ValidUser(userId: string){

	// Check format
  if(!isUuid(userId)){
    return { success: false, message: "Invalid ID." };
  }
 
	// Check if userId exist in db
  const exist = await checkQueries.getUser(userId);
  if(!exist){
    return { success: false, message: "User not found." };
  }

	// Return success
  return {success: true};

}

// Function:
// is projectId format correct?
// does projectId exist in db?
export async function ValidProject(projectId: string){
  
	// Check format
  if(!isUuid(projectId)){
    return { success: false, message: "Invalid ID." };
  }

	// Check if projectId exist in db
  const exist = await checkQueries.getProject(projectId);
  if(!exist){
    return { success: false, message: "Project not found." };
  }

	// Return success
  return { success: true };

}

// Function:
// is projectMemberId format correct?
// does projectMemberId exist in db?
export async function ValidProjectMember(projectMemberId: string){
  
	// Check format
  if(!isUuid(projectMemberId)){
    return { success: false, message: "Invalid ID." };
  }

	// Check if projectMemberId exist in db
  const exist = await checkQueries.getProjectMember(projectMemberId);
  if(!exist){
    return { success: false, message: "Project member not found." };
  }

	// Return success
  return { success: true, exist };

}

// Function:
// is taskId format correct?
// does taskId exist in db?
export async function ValidTask(taskId: string){

	// Check format
  if(!isUuid(taskId)){
    return { success: false, message: "Invalid ID." };
  }

	// Check if taskId exist in db
  const exist = await checkQueries.getTask(taskId);
  if(!exist){
    return { success: false, message: "Task not found." };
  }

	// Return success
  return { success: true, exist };

}

// Function:
// is taskAssigneeId format correct?
// does taskAssigneeId exist in db?
export async function ValidTaskAssignee(taskAssigneeId: string){

	// Check format
  if(!isUuid(taskAssigneeId)){
    return { success: false, message: "Invalid ID." };
  }

	// Check if taskAssigneeId exist in db
  const exist = await checkQueries.getTaskAssignee(taskAssigneeId);
  if(!exist){
    return { success: false, message: "Task assignee not found." };
  }

	// Return success
  return { success: true };

}

// Function:
// is commentId format correct?
// does commentId exist in db?
export async function ValidComment(commentId: string){

	// Check format
  if(!isUuid(commentId)){
    return { success: false, message: "Invalid ID." };
  }

	// Check if commentId exist in db
  const exist = await checkQueries.getComment(commentId);
  if(!exist){
    return { success: false, message: "Comment not found." };
  }

	// Return success
  return { success: true };

}

// Function:
// is format of userId and projectId correct?
// does the user have permission to do the action in the project?
export async function UserPermission(userId: string, projectId: string, action: keyof Permissions){

  // Check formats
  if(!isUuid(userId) || !isUuid(projectId)){
    return { success: false, message: "Invalid ID." };
  }
  
  // Validate user permission
  const getUser = await checkQueries.getMembership(userId, projectId);
  if(!getUser || !hasPermission(getUser.role, action)){
    return { success: false, message: "No permission for the action." }; 
  }

  // Return success
  return {success: true};

}

// Function:
// is format of projectId and userId correct?
// is user an approved member of the project?
export async function UserProjectMembership(projectId: string, userId: string){

  // Check formats
  if(!isUuid(userId) || !isUuid(projectId)){
    return { success: false, message: "Invalid ID." };
  }
  
  // Validate user membership
  const getUser = await checkQueries.getMembership(userId, projectId);
  if(!getUser){
    return { success: false, message: "Not a project member." }; 
  }

  // Return success
  return {success: true};

}

// Function:
// is format of taskId and userId correct?
// is user an approved member of the task project?
export async function UserTaskMembership(taskId: string, userId: string){

  // Check formats
  if(!isUuid(userId) || !isUuid(taskId)){
    return { success: false, message: "Invalid ID." };
  }

	// Check if taskId exist in db
  const exist = await checkQueries.getTask(taskId);
  if(!exist){
    return { success: false, message: "Task not found." };
  }
  
  // Validate user membership
  const getUser = await checkQueries.getMembership(userId, exist.projectId);
  if(!getUser){
    return { success: false, message: "Not a project member." }; 
  }

  // Return success
  return {success: true};

}