import { createQueries, deleteQueries, updateQueries } from "./queries";
import { NewUser, users } from "./schema";

export async function createUserAction(newUser: NewUser){
  return await createQueries.createUser(newUser);
}
export async function updateUserAction(clerkId: string, updUser: Partial<typeof users.$inferInsert>){
  await updateQueries.updateUser(clerkId, updUser);
}
export async function deleteUserAction(clerkId: string){
  await deleteQueries.deleteUser(clerkId);
}