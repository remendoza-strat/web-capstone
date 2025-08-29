"use client";
import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModal } from "@/lib/states";
import { deleteProject, getUserId, getUserProjects, kickMember } from "@/lib/db/tanstack";
import { useClerk, useUser } from "@clerk/nextjs";
import LoadingPage from "../pages/loading";
import ErrorPage from "../pages/error";

export function DeleteUser(){
  // Get user
  const { user, isLoaded: userLoaded } = useUser();

  // Signout
  const { signOut } = useClerk();

  // Modal closing
  const { closeModal } = useModal();

  // Changing route
  const router = useRouter();

  // Get user id
  const { 
          data: userId, 
          isLoading: userIdLoading, 
          error: userIdError 
        } 
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get user projects
  const {
          data: userProjs, 
          isLoading: userProjsLoading, 
          error: userProjsError 
  } = getUserProjects(userId ?? "", { enabled: Boolean(userId) });

  // Mutation for operations
  const deleteProjectMutation = deleteProject(userId ?? "");
  const kickMemberMutation = kickMember(userId ?? "");

  // Show loading and error
  const isLoading = !userLoaded || userIdLoading || userProjsLoading;
  const isError = userIdError || userProjsError;

  // Handle deletion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check user
    if (!userId) return;

    // Check if user can be deleted
    const notAllowedProject = userProjs?.find((project) => {
      const approvedMembers = project.members?.filter((m) => m.approved) || [];
      const userMember = approvedMembers.find((m) => m.userId === userId);
      if (!userMember) return false;
      if(userMember.role === "Project Manager"){
        const approvedPMs = approvedMembers.filter((m) => m.role === "Project Manager");
        return approvedPMs.length === 1;
      }
      return false;
    });

    // Prevent deletion
    if(notAllowedProject){
      toast.error("You have a project where you are the only approved project manager.");
      return;
    }

    // Delete or  kick
    userProjs?.map(async (project) => {
      const approvedMembers = project.members?.filter((m) => m.approved) || [];
      const userMember = approvedMembers.find((m) => m.userId === userId);
      if (!userMember) return;
      if(approvedMembers.length === 1){
        deleteProjectMutation.mutate({ projectId: project.id });
      } 
      else{
        kickMemberMutation.mutate({ pmId: userMember.id, projectId: project.id, userId })
      }
    });

    // Delete account
    await deleteAccount();
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      toast.success("Account deleted.");

      await signOut();
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete account.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
         {isLoading? (<LoadingPage/>) : isError? (<ErrorPage code={404} message="Fetching data error"/>) : 
         (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/30">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400"/>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete Account
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center mb-4 space-x-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Are you sure?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This action cannot be undone. You are about to delete your account. This will permanently remove all your data in ProjectFlow.
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Delete Account
                </button>
              </div>
            </form>
          </>
        )
        }
      </div>
    </div>
  );
}