import { ProjectMemberUser } from "@/lib/customtype"
import { useModal } from "@/lib/states"
import { useQueryClient } from "@tanstack/react-query"
import { deleteProject, kickMember } from "@/lib/db/tanstack"
import { toast } from "sonner"
import { X, AlertTriangle  } from "lucide-react"
import UserAvatar from "@/components/user-avatar"

export default function DeleteProjectMember(
  { userId, member, members, onProjectSelect } :
  { userId: string, member: ProjectMemberUser, members: ProjectMemberUser[]; onProjectSelect?: (projectId: string) => void; }){
  
  // Closing modal
  const {closeModal } = useModal();

  // Refresh data
  const queryClient = useQueryClient();
  
  // Delete project or kick member
  const deleteProjectMutation = deleteProject();
  const kickMemberMutation = kickMember();

  // Handle submit
  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()

    // Approved member checking and kicking
    if(member.approved){
      const approvedMembers = members.filter((m) => m.approved);
      const pMs = approvedMembers.filter((m) => m.role === "Project Manager");

      if(approvedMembers.length === 1){
        deleteProjectMutation.mutate({ projectId: member.projectId, userId: userId }, {
          onSuccess: () => {
            toast.success("Project left and deleted successfully.");
            closeModal();
            onProjectSelect?.(member.projectId);
            queryClient.invalidateQueries({ queryKey: ["project-members", userId] });
          },
          onError: () => {
            toast.error("Error leaving the project.");
            closeModal();
          }
        })
        return;
      }
      if(member.role === "Project Manager" && pMs.length === 1 && approvedMembers.length > 1) {
        toast.error("Project needs at least one approved project manager.");
        closeModal();
        return;
      }
    }

    // Kick member
    kickMemberMutation.mutate({ projectMemberId: member.id, projectId: member.projectId, memberUserId: member.userId, userId: userId }, {
      onSuccess: () => {
        toast.success("User successfully kicked.");
        closeModal();
        onProjectSelect?.(member.projectId);
        queryClient.invalidateQueries({ queryKey: ["project-members", userId] });
      },
      onError: (err) => {
        const error = err as { message?: string };
        toast.error(error.message ?? "Error kicking the user.");
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
              Kick Member
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
          <div className="mb-6">
            <div className="flex items-center mb-4 space-x-3">
              <UserAvatar clerkId={member.user.clerkId}/>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{member.user.fname} {member.user.lname}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.user.email}</p>
              </div>
            </div>
            <div className="p-4 border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Warning:</strong> This action cannot be undone. The member will be permanently removed from the project and will lose access to its data.
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
              disabled={deleteProjectMutation.isPending || kickMemberMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <span>{deleteProjectMutation.isPending || kickMemberMutation.isPending? "Kicking Member..." : "Kick Member"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}