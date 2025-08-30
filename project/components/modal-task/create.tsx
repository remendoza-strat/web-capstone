"use client"
import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"
import { X, Trash, CheckSquare, FileText, Calendar, AlertCircle, Tag, Search, ChartNoAxesColumn, Type, UsersRound } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { TaskSchema } from "@/lib/validations"
import { StripHTML } from "@/lib/utils"
import { Priority, PriorityArr } from "@/lib/customtype"
import type { NewTask, NewTaskAssignee, User} from "@/lib/db/schema"
import type { UserProjects } from "@/lib/customtype"
import { hasPermission } from "@/lib/permissions"
import { useModal } from "@/lib/states"
import { UserAvatar } from "@/components/user-avatar"
import { createTask, createTaskAssignee, updateProject } from "@/lib/db/tanstack"

// Dynamic import of react quill
const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

export default function CreateTask({ userId, projectsData } : { userId: string; projectsData: UserProjects[] }){
  // Closing modal
  const { closeModal } = useModal();

  // Projects user can make task
	const projects: UserProjects[] = projectsData
		.filter((project) => project.members.some((member) => member.userId === userId && member.approved && hasPermission(member.role, "addTask")))
    .map((project) => ({...project, members: project.members.filter((member) => member.approved)}));

	// Hook for project
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedColumn, setSeletectColumn] = useState(0);

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

  // Mutations to perform
  const createTaskMutation = createTask(userId);
  const createTaskAssigneeMutation = createTaskAssignee();
  const updateProjectMutation = updateProject(userId);

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
			if(!query || !selectedProjectId){
				setSuggestions([]);
				return;
			}
			const members = projects.find((p) => p.id === selectedProjectId)?.members || [];
			const selectedIds = selectedUsers.map((s) => s.user.id);
			const remaining = members.filter((m) => !selectedIds.includes(m.user.id));
			const search = query.toLowerCase();
			const userList = remaining.filter((u) => 
				(u.user.lname).toLowerCase().includes(search) ||
				(u.user.fname).toLowerCase().includes(search) ||
				(u.user.email).toLowerCase().includes(search)
			)
			setSuggestions(userList);
		}, 300);
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

    // Validate project
    if(!selectedProjectId){
      toast.error("Must select a project to assign task to.");
      return;
    }

    // Validate member
    if(selectedUsers.length === 0){
      toast.error("Must select at least one user to assign task to.");
      return;
    }
    
    // Get selected project due date
    const project = projects.find(p => p.id === selectedProjectId);
    const deadline = project?.dueDate;
    if(deadline){
      const projDue = new Date(deadline);
      const taskDue = new Date(dueDate);
      if(taskDue > projDue){
        toast.error("Task due must be on or before the project deadline.");
        return;
      }
    }

    // Get raw text of description
    const descriptionRaw = StripHTML(String(description).trim());

    // Validate input
    const result = TaskSchema.safeParse({
      title: title,
      description: descriptionRaw,
      label: label,
      dueDate: new Date(dueDate)
    });

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
      if(errors.dueDate?.[0]){
        toast.error(errors.dueDate[0]);
        return;
      } 
    }

    // Get order of task
    let lastOrder = 0;
    if(project){
      const columnTasks = project.tasks.filter(t => t.position === selectedColumn);
      if(columnTasks.length > 0){
        lastOrder = Math.max(...columnTasks.map(t => t.order), 0) + 1;
      }
    }

    if(project){
      try{
        // Create object of new task
        const newTask: NewTask = {
          projectId: project.id,
          title: title,
          description: description,
          dueDate: new Date(dueDate),
          priority: priority,
          position: selectedColumn,
          order: lastOrder,
          label: label
        };
        
        // Create task
        const taskId = await createTaskMutation.mutateAsync({ newTask });
          
        // Assign task
        for(const { user } of selectedUsers){
          const newTaskAssignee: NewTaskAssignee = {
            taskId: taskId,
            userId: user.id
          };
          await createTaskAssigneeMutation.mutateAsync(newTaskAssignee);
        }
      } 
      catch{
        toast.error("Error occurred.");
        closeModal();
        return;
      }

      // Update project  
      updateProjectMutation.mutate({ projectId: project.id, updProject: { updatedAt: new Date() } }, {
        onSuccess: () => {
          toast.success("Task created successfully.");
          closeModal();
        },
        onError: () => {
          toast.error("Error occured.");
          closeModal();
        }
      });
    }
	};

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Task
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Type className="inline w-4 h-4 mr-2"/>
              Project Name
            </label>
            <select
              value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
            {projects.length === 0 ? (
                <option disabled>No projects available</option>
              ) : 
              (
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              )
            }
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <ChartNoAxesColumn className="inline w-4 h-4 mr-2"/>
              Columns
            </label>
            <select
              value={selectedColumn} onChange={(e) => setSeletectColumn(Number(e.target.value))}
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
            {projects.length === 0? 
              (
                <option disabled>No columns available</option>
              ) : 
              (
                projects
                .filter((project) => project.id === selectedProjectId)
                .flatMap((project) =>
                  project.columnNames.map((pColumn, index) => (
                    <option key={pColumn} value={index}>
                      {pColumn}
                    </option>
                  ))
                )
              )
            }
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckSquare className="inline w-4 h-4 mr-2"/>
              Task Title
            </label>
            <input
              type="text" placeholder="Enter task title"
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="inline w-4 h-4 mr-2"/>
              Description
            </label>
            <ReactQuill
              value={description} onChange={setDescription}
              className="w-full px-3 py-3 text-gray-900 border border-gray-300 resize-none dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="inline w-4 h-4 mr-2"/>
                Due Date
              </label>
              <input
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
							  type="datetime-local"
                className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <AlertCircle className="inline w-4 h-4 mr-2"/>
                Priority
              </label>
              <select
                value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {PriorityArr.map((priority) => (
								<option key={priority} value={priority}>
									{priority}
								</option>
							))}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="inline w-4 h-4 mr-2"/>
              Label
            </label>
            <input
              type="text" placeholder="Enter task label"
              value={label} onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <UsersRound className="inline w-4 h-4 mr-2"/>
              Assignees
            </label>
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500"/>
              <input
                className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                type="text" placeholder="Search by name or email"
                value={query} onChange={(e) => setQuery(e.target.value)}
              />
              {query && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 z-10 mt-1 overflow-y-auto bg-white border border-gray-200 shadow-lg top-full dark:bg-gray-800 dark:border-gray-700 rounded-xl max-h-48">
                  {suggestions.map((user) => (
                    <li
                      key={user.user.id}
                      className="flex items-center px-4 py-3 space-x-3 transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => handleAddUser(user)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <UserAvatar clerkId={user.user.clerkId}/>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.user.fname} {user.user.lname}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {user.user.email} - {user.role}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {selectedUsers.length > 0 && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Users
              </label>
              <ul className="space-y-2">
                {selectedUsers.map((user, index) => (
                  <li
                    key={user.user.id}
                    className="flex items-center justify-between p-3 border border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-xl dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <UserAvatar clerkId={user.user.clerkId}/>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.user.fname} {user.user.lname}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {user.user.email} - {user.role}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(index)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Trash className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex pt-4 space-x-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTaskMutation.isPending || createTaskAssigneeMutation.isPending || updateProjectMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {createTaskMutation.isPending || createTaskAssigneeMutation.isPending || updateProjectMutation.isPending? "Creating Task..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}