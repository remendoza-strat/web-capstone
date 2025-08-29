"use client"
import { Mail, Calendar, Edit2, UserX  } from "lucide-react"
import { ProjectMemberUser } from "@/lib/customtype"
import { useModal } from "@/lib/states"
import { UserAvatar } from "@/components/user-avatar"

export function MemberCard(
  { userId, canEdit, member, onUpdateClick, onDeleteClick } :
  { userId: string, canEdit: boolean, member: ProjectMemberUser; onUpdateClick?: (member: ProjectMemberUser) => void; onDeleteClick?: (member: ProjectMemberUser) => void; }){
 
  // For opening modal
  const { openModal } = useModal();

  // Add identifier
  const currentUser = userId === member.userId? "(You)" : "";

  return(
    <div className="p-6 transition-all duration-200 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <UserAvatar clerkId={member.user.clerkId}/>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {member.user.fname} {member.user.lname} {currentUser}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {member.role}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Mail className="w-4 h-4"/>
          <span>{member.user.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4"/>
          <span>Joined {(member.updatedAt)?.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-1 transition-opacity duration-200 group-hover:opacity-100">
            {canEdit && (
              <>             
                <button 
                  type="button"
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {onUpdateClick?.(member); openModal("updateMember")}}
                >
                  <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                </button>
                <button 
                  type="button"
                  className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => {onDeleteClick?.(member); openModal("deleteMember")}}
                >
                  <UserX className="w-4 h-4 text-red-500 dark:text-red-400"/>
                </button>
              </>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              member.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {member.approved ? "Approved" : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
}