"use client"
import "../globals.css"
import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"
import { X, Trash } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { TaskSchema } from "@/lib/validations"
import { StripHTML } from "@/lib/utils"
import { Priority, PriorityArr } from "@/lib/customtype"
import type { NewTask, NewTaskAssignee, User} from "@/lib/db/schema"
import { useKanbanContext } from "../kanban-provider"
import { useModal } from "@/lib/states"
import { createTask } from "@/lib/hooks/tasks"
import { createTaskAssignee } from "@/lib/hooks/taskAssignees"

// Dynamic import of react quill
const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

export function CreateTask({columnIndex} : {columnIndex: number}){
  const { closeModal } = useModal();
  const { projectData } = useKanbanContext();
  const createTaskMutation = createTask();
  const createTaskAssigneeMutation = createTaskAssignee();

  // Hook for user
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{user: User, role: string}[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{user: User, role: string}[]>([]);
  
  // Hook for input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [label, setLabel] = useState("");



  // Getting suggested user and removing already selected user
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try{
        if(!query){
          setSuggestions([]);
          return;
        }
        const members = projectData.members;
        const selectedIds = selectedUsers.map((u) => u.user.id);
        const remainingMembers = members.filter((m) => !selectedIds.includes(m.user.id));
        const search = query.toLowerCase();
        const userList = remainingMembers.filter((u) => 
          (u.user.lname).toLowerCase().includes(search) ||
          (u.user.fname).toLowerCase().includes(search) ||
          (u.user.email).toLowerCase().includes(search) ||
          (u.role).toLowerCase().includes(search)
        )
        setSuggestions(userList);
      }
      catch{return}
    }, 200);
    return () => clearTimeout(timeout);
  }, [query, selectedUsers]);

  // Add selected user to array
  const handleAddUser = ({ user, role } : { user: User, role: string }) => {
    setSelectedUsers((prev) => [...prev, { user, role }]);
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

      const deadline = projectData.dueDate;

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

     const lastOrder = Math.max(
  ...projectData.tasks
    .filter(t => t.position === columnIndex) 
    .map(t => t.order),                     
  0                                         
);


      // Create object of new task
      const newTask: NewTask = {
        projectId: projectData.id,
        title: title,
        description: description,
        dueDate: new Date(dueDate),
        priority: priority,
        position: columnIndex,
        order: lastOrder + 1,
        label: label
      };

const id = await createTaskMutation.mutateAsync(newTask); 
    for (const { user } of selectedUsers) {
      const newTaskAssignee: NewTaskAssignee = {
        taskId: id,
        userId: user.id,
      };
      await createTaskAssigneeMutation.mutateAsync(newTaskAssignee);
    }

      // Display success and close modal
      toast.success("All members assigned to task.");
      closeModal();
    }
    catch{return}
  };

  return(
    <div className="modal-background">
      <div className="max-w-md h-[90vh] overflow-y-auto modal-form">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Create New Task
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="modal-form-label">
              Title
            </label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              type="text" placeholder="Enter task title"
              className="modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              Description
            </label>
            <ReactQuill 
              theme="snow"
              className="modal-form-input"
              value={description} onChange={setDescription}
            />
          </div>
          <div>
            <label className="modal-form-label">
              Due Date
            </label>
            <input
              value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              type="datetime-local"
              className="cursor-pointer modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              Priority
            </label>
            <select
              className="cursor-pointer modal-form-input"
              value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PriorityArr.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="modal-form-label">
              Label
            </label>
            <input
              value={label} onChange={(e) => setLabel(e.target.value)}
              type="text" placeholder="Enter task label"
              className="modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              User
            </label>
            <div className="relative">
              <input
                className="modal-form-input"
                type="text" placeholder="Search by name or email"
                value={query} onChange={(e) => setQuery(e.target.value)}/>
                  {query && suggestions.length > 0 && (
                    <ul className="modal-form-suggestion-ul">
                      {suggestions.map((user) => (
                        <li
                          key={user.user.id}
                          className="modal-form-suggestion-li"
                          onClick={() => handleAddUser(user)}>
                            <div className="modal-form-suggestion-main">
                              {user.user.fname} {user.user.lname}
                            </div>
                            <div className="modal-form-suggestion-sec">{user.user.email} - {user.role}</div>
                        </li>
                      ))}
                    </ul>
                  )}
            </div>
          </div>
          {selectedUsers.length > 0 && (
            <div>
              <label className="modal-form-label">
                Selected Users
              </label>
              <ul className="space-y-2">
                {selectedUsers.map((user, index) => (
                  <li key={user.user.id} className="flex items-center justify-between gap-2 modal-form-input">
                    <div className="flex-1">
                      <div className="modal-form-suggestion-main">
                        {user.user.fname} {user.user.lname}
                      </div>
                      <div className="modal-form-suggestion-sec">{user.user.email} - {user.role}</div>
                    </div>
                    <button type="button" onClick={() => handleRemoveUser(index)}>
                      <Trash className="modal-form-trash" size={18}/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
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