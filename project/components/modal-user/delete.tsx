"use client"
import { UserProjects } from "@/lib/customtype"
import { useClerk } from "@clerk/nextjs"
import { useModal } from "@/lib/states"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { X, AlertTriangle } from "lucide-react"

export default function DeleteUser({ userId, userProjs } : { userId: string, userProjs: UserProjects[] }){
  // Signout
  const { signOut } = useClerk();

  // Modal closing
  const { closeModal } = useModal();

  // Changing route
  const router = useRouter();

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle deletion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user can be deleted
    const notAllowed = userProjs.filter((project) => {
      const approvedMembers = project.members.filter((m) => m.approved) || [];
      const userMember = approvedMembers.find((m) => m.userId === userId);
      if (!userMember) return false;
      if(userMember.role === "Project Manager"){
        const approvedPMs = approvedMembers.filter((m) => m.role === "Project Manager");
        return approvedPMs.length === 1 && approvedMembers.length > 1;
      }
      return false;
    });

    // Prevent deletion
    if(notAllowed.length > 0){
      toast.error("You have a project where you are the only approved project manager.");
      closeModal();
      return;
    }

    // Start loading
    setLoading(true);

    // Delete account
    await deleteAccount();
  };

  // Delete account in clerk and db
  const deleteAccount = async () => {
    try{
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if(!res.ok){
        toast.error("Account deletion error.");
        setLoading(false);
        closeModal();
      }
      toast.success("Account deleted.");
      await signOut();
      router.push("/");
    } 
    catch{
      toast.error("Account deletion error.");
      setLoading(false);
      closeModal();
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
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
              disabled={loading}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {loading? "Deleting Account..." : "Delete Account" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}