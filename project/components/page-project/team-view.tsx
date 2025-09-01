import { MembersWithData } from "@/lib/customtype"
import { useRouter } from "next/navigation"
import { Mail, Shield, Clock, Settings } from "lucide-react"
import UserAvatar from "@/components/user-avatar"

export default function TeamView({ members } : { members: MembersWithData[] }){
  // Going to team page
  const router = useRouter();

  return(
    <div>
      <div className="mb-6">
        <div className="flex items-end justify-end mb-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
							onClick={() => router.push("/team")}
              className="flex items-center px-6 py-3 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Settings className="w-5 h-5"/>
              <span>Manage Teams</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 shadow-sm dark:bg-gray-900 rounded-2xl dark:border-gray-700">
        <div className="overflow-hidden">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col p-4 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <UserAvatar clerkId={member.user.clerkId}/>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {member.user.fname} {member.user.lname}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300 sm:text-sm">
                    <Mail className="w-4 h-4 mr-2"/>
                    {member.user.email}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center mt-3 space-x-2 sm:mt-0 sm:space-x-4">
                <div className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-300">
                  {member.role}
                </div>
                <div className={`
                  flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${member.approved 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }
                `}>
                  {member.approved ? (
                    <>
                      <Shield className="w-3 h-3 mr-1"/>
                      Approved
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1"/>
                      Pending
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}