"use client"
import "./globals.css"
import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"
import { X, Trash } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { TaskSchema } from "@/lib/validations"
import { StripHTML } from "@/lib/utils"
import { Priority, PriorityArr } from "@/lib/customtype"
import { createTaskAction, createTaskAssigneeAction, updateProjectTimeAction } from "@/lib/db/actions"
import type { NewTask, NewTaskAssignee, Project, User} from "@/lib/db/schema"
import type { UserProjects } from "@/lib/customtype"

// Dynamic import of react quill
const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

export function CreateTaskButton({ close, userProjs } : { close: () => void; userProjs: UserProjects[] }){
  // Get all projects from prop
  const projects: Project[] = userProjs.map(({ members, tasks, ...project}) => project); 

  // Hook for project
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Hook for user
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ user: User }[]>([]);
  
  // Hook for input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [label, setLabel] = useState("");

  // Set initial selected project
  useEffect(() =>{
    if(projects.length > 0){
      setSelectedProjectId(projects[0].id);
    }
  }, []);

  // Remove selected and suggestion when project is changed
  useEffect(() =>{
    setSuggestions([]);
    setSelectedUsers([]);
  }, [selectedProjectId]);

  // Getting suggested user and removing already selected user
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try{
        if(!query || !selectedProjectId){
          setSuggestions([]);
          return;
        }
        const project = userProjs.find((up) => up.id === selectedProjectId)
        const members = project?.members.map((m) => m.user) || [];
        const selectedIds = selectedUsers.map((u) => u.user.id);
        const remainingMembers = members.filter((m) => !selectedIds.includes(m.id));
        const search = query.toLowerCase();
        const userList = remainingMembers.filter((user) => 
          (user.lname).toLowerCase().includes(search) ||
          (user.fname).toLowerCase().includes(search) ||
          (user.email).toLowerCase().includes(search)
        )
        setSuggestions(userList);
      }
      catch{return}
    }, 200);
    return () => clearTimeout(timeout);
  }, [query, selectedUsers]);

  // Add selected user to array
  const handleAddUser = (user: User) => {
    setSelectedUsers((prev) => [...prev, { user }]);
    setQuery("");
    setSuggestions([]);
  };

  // Remove user from array
  const handleRemoveUser = (index: number) => {
    const updated = [...selectedUsers];
    updated.splice(index, 1);
    setSelectedUsers(updated);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      // Validate project id
      const projectValidation = TaskSchema.safeParse({
        projectId: selectedProjectId
      });

      // Display project id error
      if(!projectValidation.success){
        const errors = projectValidation.error.flatten().fieldErrors;
        if(errors.projectId?.[0]){
          toast.error(errors.projectId[0]);
          return;
        }
      }

      // Get selected project due date
      const project = projects.find(p => p.id === selectedProjectId);
      const deadline = project?.dueDate;

      // Return if deadline is null
      if (!deadline) return;

      // Get raw text of description
      const descriptionRaw = StripHTML(String(description).trim());

      // Validate input
      const result = TaskSchema.safeParse({
        title: title,
        description: descriptionRaw,
        label: label,
        members: selectedUsers,
        dueDate: new Date(dueDate),
        deadline: new Date(deadline)
      })

      // Display errors
      if(!result.success){
        const errors = result.error.flatten().fieldErrors;
        if(errors.title?.[0]){
          toast.error(errors.title[0]);
          return;
        }
        if(errors.description?.[0]){
          toast.error(errors.description[0]);
          return;
        }
        if(errors.label?.[0]){
          toast.error(errors.label[0]);
          return;
        }
        if(errors.members?.[0]){
          toast.error(errors.members[0]);
          return;
        } 
        if(errors.dueDate?.[0]){
          toast.error(errors.dueDate[0]);
          return;
        } 
      }

      // Create object of new task
      const newTask: NewTask = {
        projectId: selectedProjectId,
        title: title,
        description: description,
        dueDate: new Date(dueDate),
        priority: priority,
        position: 0,
        columnCount: 5,
        label: label
      };
      
      // Add and get the task id of the created task
      const taskId = await createTaskAction(newTask);

      // Iterate the array and add user content to database
      for(const { user } of selectedUsers){
        const newTaskAssignee: NewTaskAssignee = {
          taskId: taskId,
          userId: user.id
        };
        await createTaskAssigneeAction(newTaskAssignee);
      }

      // Update project for activity
      await updateProjectTimeAction(selectedProjectId);

      // Display success and close modal
      toast.success("All members assigned to task.");
      close();
    }
    catch{return}
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open-bg">
      <div className="w-full max-w-md h-[90vh] p-6 mx-4 rounded-lg modal-form-color overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Create New Task
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
              className="w-full cursor-pointer modal-form-input"
              value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                {projects.length === 0 ? (
                  <option disabled>No projects available</option>
                ) : 
                (
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))
                )}
            </select>
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Title
            </label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              type="text" placeholder="Enter task title"
              className="w-full modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Description
            </label>
						<ReactQuill 
              theme="snow"
              className="w-full modal-form-input"
              value={description} onChange={setDescription}
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Due Date
            </label>
            <input
              value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              type="datetime-local"
              className="w-full cursor-pointer modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Priority
            </label>
            <select
              className="w-full cursor-pointer modal-form-input"
              value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PriorityArr.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Label
            </label>
            <input
              value={label} onChange={(e) => setLabel(e.target.value)}
              type="text" placeholder="Enter task label"
              className="w-full modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              User
            </label>
            <div className="relative">
              <input
                className="w-full modal-form-input"
                type="text" placeholder="Search by name or email"
                value={query} onChange={(e) => setQuery(e.target.value)}/>
                  {query && suggestions.length > 0 && (
                    <ul className="absolute w-full overflow-y-auto z-60 max-h-48 modal-form-suggestion-ul">
                      {suggestions.map((user) => (
                        <li
                          key={user.id}
                          className="modal-form-suggestion-li"
                          onClick={() => handleAddUser(user)}>
                            <div className="modal-form-suggestion-main">
                              {user.fname} {user.lname}
                            </div>
                            <div className="modal-form-suggestion-sec">{user.email}</div>
                        </li>
                      ))}
                    </ul>
                  )}
            </div>
          </div>
          {selectedUsers.length > 0 && (
            <div>
              <label className="block m-2 modal-form-label">
                Selected Users
              </label>
              <ul className="space-y-2">
                {selectedUsers.map((user, index) => (
                  <li key={user.user.id} className="flex items-center justify-between gap-2 modal-form-input">
                    <div className="flex-1">
                      <div className="modal-form-suggestion-main">
                        {user.user.fname} {user.user.lname}
                      </div>
                      <div className="modal-form-suggestion-sec">{user.user.email}</div>
                    </div>
                    <button type="button" onClick={() => handleRemoveUser(index)}>
                      <Trash className="modal-form-trash" size={18}/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end pt-4 space-x-3">
            <button onClick={close} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}