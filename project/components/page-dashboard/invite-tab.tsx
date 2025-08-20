import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { UserProjects } from '@/lib/customtype';
import { LimitChar } from '@/lib/utils';


export function InviteTab({ userId, userProjs } : { userId: string, userProjs: UserProjects[] }){

const projects: UserProjects[] = userProjs
.filter((project) =>
	project.members.some(
		(member) => member.userId === userId && !member.approved
	)
)


const invitations = projects.map((project) => {
  const member = project.members.find((m) => m.userId === userId);

  return {
    pName: project.name,
    pDesc: LimitChar(project.description, 75),
    projectMemberId: member?.id ?? null,
    createdAt: member?.createdAt ?? undefined,
    role: member?.role ?? null
  };
});

const getTimeAgo = (date?: Date | string) => {
  if (!date) return "Unknown";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) return "Invalid date";

  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};



  return (
    <div className="p-6 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        <Clock className="w-5 h-5 mr-2 text-blue-600" />
        Project Invitations
      </h3>
      <div className="space-y-3 overflow-y-auto max-h-64">
        {invitations.length === 0 ? (
          <div className="py-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full dark:bg-gray-700">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">No pending invitations</p>
          </div>
        ) : (
          invitations.map((invitation) => (
            <div key={invitation.projectMemberId} className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{invitation.pName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You are invited as <span className="font-medium">{invitation.role}</span>
                  </p>
									<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
										{invitation.createdAt ? getTimeAgo(invitation.createdAt) : "Unknown"}
									</p>

                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  
                  className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept</span>
                </button>
                <button
                  
                  className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};