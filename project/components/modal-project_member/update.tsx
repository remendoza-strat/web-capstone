import { ProjectMemberUser, Role, RoleArr } from "@/lib/customtype";
import { useModal } from "@/lib/states";
import { Briefcase, Building, X, UserCog  } from "lucide-react";
import { useState } from "react";

export function UpdateProjectMember({ member, image, members }: { member: ProjectMemberUser, image: string, members: ProjectMemberUser[] }) {
  const [role, setRole] = useState<Role>(member.role); 

  console.log(members);

	const {closeModal } = useModal();
   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Member</h2>
          <button
            onClick={closeModal}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form className="p-6 space-y-4">
          <div className="mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12">
                {image ? (
    <img
      src={image}
      alt={`${member.user.fname} ${member.user.lname}`}
      className="object-cover w-12 h-12 rounded-full"
    />
  ) : (
    <div className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
      {member.user.fname[0]}
    </div>
  )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{member.user.fname} {member.user.lname}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{member.user.email}</p>
              </div>
            </div>
          </div>


          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <UserCog className="inline w-4 h-4 mr-2" />
              Role
            </label>
            <select
              value={role} onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-xl dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              
              {RoleArr.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>


          <div className="flex pt-4 space-x-3">
            <button
              type="button"
           
              className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-xl dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}