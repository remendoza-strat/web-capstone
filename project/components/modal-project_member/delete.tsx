import { ProjectMemberUser } from "@/lib/customtype";
import { deleteProject, kickMember } from "@/lib/hooks/projectMembers";
import { useModal } from "@/lib/states";
import { X, AlertTriangle, Trash2  } from "lucide-react";
import { toast } from "sonner";

export function DeleteProjecMember({ userId, member, image, members }: { userId: string, member: ProjectMemberUser, image: string, members: ProjectMemberUser[] }){
  // Closing modal
  const {closeModal } = useModal();
  
  // Delete or kick member
  const deleteProjectMutation = deleteProject(userId);
  const kickMemberMutation = kickMember(userId);

  // Count approved members
  const approved = members.filter((m) => m.approved).length;

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Do not proceed if only one project member left
    const pmCount = members.filter((m) => m.role === "Project Manager" && m.approved).length;
    if(pmCount === 1 && approved > 1){
      toast.error("Add or assign other member as Project Manager first.");
      closeModal();
      return;
    }

    // Delete the project if only one member left
    if(approved === 1){
      deleteProjectMutation.mutate({ projectId: member.projectId }, {
        onSuccess: () => {
          toast.success("Project left and deleted successfully.");
          closeModal();
        },
        onError: () => {
          toast.error("Error occured.");
          closeModal();
        }
      });
      return;
    }

    // Kick the user
    kickMemberMutation.mutate({pmId: member.id, projectId: member.projectId, userId: member.user.id}, {
      onSuccess: () => {
        toast.success("User kicked successfully.");
        closeModal();
      },
      onError: () => {
        toast.error("Error occured.");
        closeModal();
      }
    });
  }


  // deleted at
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kick Member</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4 space-x-3">
              {image ? 
                  (
                    <img
                      src={image}
                      className="object-cover w-12 h-12 rounded-full"
                    />
                  ) : 
                  (
                    <div className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      {member.user.fname[0]}
                    </div>
                  )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{member.user.fname}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.user.email}</p>
              </div>
            </div>
            
            <div className="p-4 border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Warning:</strong> This action cannot be undone. The member will be permanently removed from all projects and lose access to the system.
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-xl dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center flex-1 px-4 py-2 space-x-2 text-white transition-colors bg-red-600 rounded-xl hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}