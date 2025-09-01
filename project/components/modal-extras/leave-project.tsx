import { ProjectData } from "@/lib/customtype"
import { useModal } from "@/lib/states"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { deleteProject, leaveProject } from "@/lib/db/tanstack"
import { toast } from "sonner"
import { X, AlertTriangle  } from "lucide-react"

export default function LeaveProject({ userId, projectData } : { userId: string, projectData: ProjectData }){
  // Closing modal
  const {closeModal } = useModal();

	// Route for when deleted
	const router = useRouter();

  // Refresh data
  const queryClient = useQueryClient();
  
  // Delete or leave project
  const deleteProjectMutation = deleteProject();
  const leaveProjectMutation = leaveProject();  

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      // Get data needed
      const approvedMembers = projectData.members.filter((m) => m.approved);
      const user = approvedMembers.find((m) => m.userId === userId);
      const pMs = approvedMembers.filter((m) => m.role === "Project Manager");
      if (!user) return;

    if(approvedMembers.length === 1){
      deleteProjectMutation.mutate({ projectId: projectData.id, userId: userId }, {
        onSuccess: () => {
          toast.success("Project left and deleted successfully.");
          queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
					router.push("/projects");
          closeModal();
        },
        onError: () => {
          toast.error("Error leaving the project.");
          closeModal();
        }
      });
      return;
    }

    if(user.role === "Project Manager" && pMs.length === 1 && approvedMembers.length > 1) {
        toast.error("Project needs at least one approved project manager.");
        closeModal();
        return;
    }

    // Leave project
    leaveProjectMutation.mutate({pmId: user.id, projectId: projectData.id, memberId: userId}, {
      onSuccess: () => {
        toast.success("You have successfully left the project.");
        queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
				router.push("/projects");
        closeModal();
      },
      onError: () => {
        toast.error("Error leaving the project.");
        closeModal();
      }
    });
  }

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full dark:bg-orange-900/30">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400"/>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Leave Project
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
              	Once you leave <strong>"{projectData.name}"</strong>, you would not be able to access the project or its data again. This action cannot be undone.
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
              disabled={deleteProjectMutation.isPending || leaveProjectMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-orange-600 hover:bg-orange-700 rounded-xl"
            >
              {deleteProjectMutation.isPending || leaveProjectMutation.isPending? "Leaving Project..." : "Leave Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}