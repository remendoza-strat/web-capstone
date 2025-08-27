import React from "react"
import { toast } from "sonner"
import { Check, X, Clock } from "lucide-react"
import { UserProjects } from "@/lib/customtype"
import { TimeAgo } from "@/lib/utils"
import { deleteProjectMember, updateProject, updateProjectMember } from "@/lib/db/tanstack"

export function InviteTab({ userId, userProjs } : { userId: string, userProjs: UserProjects[] }){
	// Mutation for operation
	const updateProjectMemberMutation = updateProjectMember(userId);
	const updateProjectMutation = updateProject(userId);
	const deleteProjectMemberMutation = deleteProjectMember(userId);

	// Button processing
	const isProcessing = updateProjectMemberMutation.isPending || updateProjectMutation.isPending || deleteProjectMemberMutation.isPending;

	// Get project where member is not approved
	const projects = userProjs.filter((p) => p.members.some((m) => m.userId === userId && !m.approved))

	// Get data from the project
	const invitations = projects.map((project) => {
		const member = project.members.find((m) => m.userId === userId);
		return{
			projId: project.id,
			pName: project.name,
			pDesc: project.description,
			pmId: member?.id ?? null,
			pmRole: member?.role ?? null,
			pmTime: TimeAgo(member?.createdAt)
		};
	});

	// Accepting membership invite
	function acceptInvite(pmId: string, projectId: string){
		if(!pmId || !projectId) return;
		
    // Update member approval
    updateProjectMemberMutation.mutate({ pmId: pmId, updPm : { approved: true }}, {
      onSuccess: () => {
        toast.success("Project membership accepted.");
      },
      onError: () => {
        toast.error("Error occured.");
      }
    });

	// Update project  
	updateProjectMutation.mutate({ projectId: projectId, updProject: { updatedAt: new Date() }});
	}

	// Rejecting membership invite
	function rejectInvite(pmId: string, projectId: string){
		if(!pmId || !projectId) return;

		deleteProjectMemberMutation.mutate({pmId: pmId}, {
      onSuccess: () => {
        toast.success("Project membership declined.");
      },
      onError: () => {
        toast.error("Error occured.");
      }
    });
	}

  return(
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        <Clock className="w-5 h-5 mr-2 text-blue-600"/>
        Project Invitations
      </h3>
      <div className="space-y-3 overflow-y-auto max-h-64">
        {invitations.length === 0 ? 
					(
						<div className="py-8 text-center">
							<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full dark:bg-gray-700">
								<Clock className="w-8 h-8 text-gray-400 dark:text-gray-500"/>
							</div>
							<p className="text-gray-600 dark:text-gray-300">No pending invitations</p>
						</div>
					) : 
					(
						invitations.map((invitation) => (
							<div key={invitation.pmId} className="p-4 border border-gray-200 rounded-xl dark:border-gray-700">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<h4 className="font-semibold text-gray-900 dark:text-white">
											{invitation.pName}
										</h4>
										<p className="text-sm text-gray-900 dark:text-white">
											{invitation.pDesc}
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-300">
											You are invited as <span className="font-medium">{invitation.pmRole}</span>
										</p>
										<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
											{invitation.pmTime}
										</p>
									</div>
								</div>
								<div className="flex space-x-2">
									<button
										type="button"
										disabled={isProcessing}
										onClick={() => acceptInvite(invitation.pmId ?? "", invitation.projId)}
										className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm font-medium text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
									>
										<Check className="w-4 h-4"/>
										<span>{updateProjectMemberMutation.isPending || updateProjectMutation.isPending? "Accepting..." : "Accept"}</span>
									</button>
									<button
										type="button"
										disabled={isProcessing}
										onClick={() => rejectInvite(invitation.pmId ?? "", invitation.projId)}
										className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-xl dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										<X className="w-4 h-4"/>
										<span>{deleteProjectMemberMutation.isPending? "Rejecting..." : "Reject"}</span>
									</button>
								</div>
							</div>
						))
					)
				}
      </div>
    </div>
  );
}