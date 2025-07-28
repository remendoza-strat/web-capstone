import { X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getProjectsUserCanAddAction, getUserIdAction, getNonMembersOfProjectAction, addProjectMemberAction } from '@/lib/db/actions';
import type { NewProjectMember, User } from "@/lib/db/schema";
import { ProjectMemberSchema } from "@/lib/validations";
import { toast } from "sonner";

export function AddMemberButton({ close }: { close: () => void }) {
  const { user } = useUser();
  const [projects, setProjects] = useState<{ projectId: string; projectName: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{userId: string; userEmail: string; userFname: string; userLname: string}[]>([]);
  const [selectedUser, setSelectedUser] = useState<{userId: string; userEmail: string; userFname: string; userLname: string} | null>(null);
  type Role = "Viewer" | "Project Manager" | "Developer" | "Designer" | "QA Engineer";
  const [role, setRole] = useState<Role>("Viewer");

  useEffect(() => {
    const fetchProjects = async () => {
      const clerkId = user!.id;
      const userId = (await getUserIdAction(clerkId))!;

      const projectList = await getProjectsUserCanAddAction(userId);
      setProjects(projectList);

      if(projectList.length > 0){
        setSelectedProjectId(projectList[0].projectId);
      }
    };
    fetchProjects();
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if(!query || !selectedProjectId){
        setSuggestions([]);
        return;
      }

      const users = await getNonMembersOfProjectAction(selectedProjectId, query);
      setSuggestions(users);
    }, 300);  
    return () => clearTimeout(timeout);
  }, [query, selectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = ProjectMemberSchema.safeParse({
      projectId: selectedProjectId,
      userId: selectedUser?.userId!,
      role: role 
    });

    if(!result.success){
      const errors = result.error.flatten().fieldErrors;

      if(errors.projectId?.[0]){
        toast.error(errors.projectId[0]);
        return;
      }
      if(errors.userId?.[0]){
        toast.error(errors.userId[0]);
        return;
      }
    }

    const newProjectMember: NewProjectMember = {
      projectId: selectedProjectId,
      userId: selectedUser?.userId!,
      role: role 
    }

    addProjectMemberAction(newProjectMember);

    toast.success("Member added.");
    close();
  }

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open-bg">
      <div className="w-full max-w-md p-6 mx-4 rounded-lg modal-form-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Add Team Member
          </h3>
          <button onClick={close} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block m-2 modal-form-label">
              Project
            </label>
            <select
              className="w-full modal-form-input"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.length === 0 ? (
                <option disabled>No projects available</option>
              ) : 
              (
                projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              User
            </label>
            <div className="relative">
              <input
                className="w-full modal-form-input"
                type="text" placeholder="Search by name or email"
                value={
                  selectedUser
                    ? `${selectedUser.userFname} ${selectedUser.userLname} (${selectedUser.userEmail})`
                    : query
                }
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedUser(null);
                }}
              />
              {!selectedUser && (
                <ul className="absolute w-full overflow-y-auto z-60 max-h-48 modal-form-suggestion-ul">
                  {suggestions.length > 0 ? (
                    suggestions.map((sug) => (
                      <li
                        className="modal-form-suggestion-li"
                        key={sug.userId}
                        onClick={() => {
                          setSelectedUser({
                            userId: sug.userId,
                            userEmail: sug.userEmail,
                            userFname: sug.userFname,
                            userLname: sug.userLname,
                          });
                          setQuery("");
                          setSuggestions([]);
                        }}
                      >
                        <div className="modal-form-suggestion-main">
                          {sug.userFname} {sug.userLname}
                        </div>
                        <div className="modal-form-suggestion-sec">{sug.userEmail}</div>
                      </li>
                    ))
                  ) : 
                  (
                    query && (
                      <li className="modal-form-suggestion-sec">
                        No users found
                      </li>
                    )
                  )
                }
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Role
            </label>
            <select 
              className="w-full modal-form-input"
              value={role} onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="Viewer">Viewer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
            </select>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button onClick={close} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}