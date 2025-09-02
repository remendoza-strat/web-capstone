"use client"
import { ProjectData } from "@/lib/customtype"
import { useModal } from "@/lib/states"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { deleteProject } from "@/lib/db/tanstack"
import { toast } from "sonner"
import { X, AlertTriangle } from "lucide-react"

export default function DeleteProject({ userId, projectData } : { userId: string, projectData: ProjectData }){
  // Closing modal
  const { closeModal } = useModal();

  // Refresh data
  const queryClient = useQueryClient();

	// Route for when deleted
	const router = useRouter();

	// Deleting project
	const deleteMutation = deleteProject();

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	
		// Delete project
		deleteMutation.mutate({ projectId: projectData.id, userId: userId }, {
			onSuccess: () => {
				toast.success("Project deleted successfully.");
				router.push("/projects");
        queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
				closeModal();
		
			},
			onError: (err) => {
				const error = err as { message?: string };
        toast.error(error.message ?? "Error deleting project.");
				closeModal();
			}
		});
	}
	
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400"/>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Delete Project
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
                You are about to delete <strong>"{projectData.name}"</strong> project. This action will permanently delete the project and all its data.
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
							disabled={deleteMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {deleteMutation.isPending? "Deleting Project..." : "Delete Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}