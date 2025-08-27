"use client"
import "react-quill-new/dist/quill.snow.css"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { validate as isUuid } from "uuid"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Edit2, Flag, UserRound, Save, Search, Tag, UserMinus, X, Trash2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { hasPermission } from "@/lib/permissions"
import { Priority, PriorityArr, Role } from "@/lib/customtype"
import { DateTimeFormatter, FormatDateDisplay, StripHTML } from "@/lib/utils"
import ErrorPage from "@/components/pages/error"
import LoadingPage from "@/components/pages/loading"
import { UserAvatar } from "@/components/user-avatar"
import { NewTaskAssignee, tasks } from "@/lib/db/schema"
import { getUserId, getTaskData, KanbanUpdateTask, createTaskAssignee, deleteTaskAssignee, KanbanUpdateProject, KanbanDeleteTask } from "@/lib/db/tanstack"
import type { User } from "@/lib/db/schema"
import { TaskSchema } from "@/lib/validations"
import { CommentSection } from "@/components/page-task/comment-section"

// Dynamic import of react quill
const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

export default function TaskPage(){
  // Changing route
  const router = useRouter();

  // Mutation for operations
  const createTaskAssigneeMutation = createTaskAssignee();
  const deleteTaskAssigneeMutation = deleteTaskAssignee();
  const updateTaskMutation = KanbanUpdateTask();
  const updateProjectMutation = KanbanUpdateProject();
  const deleteTaskMutation = KanbanDeleteTask();

  // Hooks for input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [label, setLabel] = useState("");

  // Hooks for user filtering
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ user: User; role: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ user: User; role: string }[]>([]);

  // Hook for editing UI
  const [isEditing, setIsEditing] = useState(false);
  
  // Get task id from parameter
  const params = useParams<{ id: string }>();
  const taskId = params.id;

  // Get current user
  const { user, isLoaded: userLoaded } = useUser();

  // Check if valid task id
  if(!taskId || !isUuid(taskId)){
    return <ErrorPage code={404} message="Invalid task ID"/>;
  }

  // Get user id with clerk id
  const {
          data: userId,
          isLoading: userIdLoading,
          error: userIdError
        }
  = getUserId(user?.id ?? "", { enabled: Boolean(user?.id) });

  // Get task data with task id
  const {
          data: taskData,
          isLoading: taskDataLoading,
          error: taskDataError
        } 
  = getTaskData(taskId, { enabled: Boolean(taskId) });

  // Set initial values
  useEffect(() => {
    if(taskData){
      setTitle(taskData.title);
      setDescription(taskData.description);
      setDueDate(FormatDateDisplay(taskData.dueDate));
      setPriority(taskData.priority);
      setLabel(taskData.label);
      const initialUsers = taskData.assignees.map((a) => ({
        user: a.user,
        role: taskData.project.members.find(m => m.userId === a.userId)?.role || ""
      }));
      setSelectedUsers(initialUsers);
    }
  }, [taskData]);

  // Getting suggested user and removing already selected user
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if(!query){
        setSuggestions([]);
        return;
      }
      if(taskData){
        const members = taskData.project.members;
        const selectedIds = selectedUsers.map((s) => s.user.id);
        const remaining = members.filter((m) => !selectedIds.includes(m.user.id));
        const search = query.toLowerCase();
        const userList = remaining.filter((u) => 
            (u.user.lname).toLowerCase().includes(search) ||
            (u.user.fname).toLowerCase().includes(search) ||
            (u.user.email).toLowerCase().includes(search)
        )
        setSuggestions(userList);
      }
    }, 300);
    return () => clearTimeout(timeout);
  },[query, selectedUsers]);

  // Adding user
  const handleAddUser = ({ user, role }: { user: User; role: string }) => {
    setSelectedUsers((prev) => [...prev, { user, role }]);
    setQuery("");
    setSuggestions([]);
  };

  // Removing user
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.user.id !== userId));
  };

  // Get color of priority
  function PriorityColor(priority: string){
    if (priority === "High") return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
    if (priority === "Medium") return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400";
    if (priority === "Low") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
  };

  // Delete task
  function deleteTask(){
    if(taskData){
      deleteTaskMutation.mutate({projectId: taskData.project.id, taskId: taskData.id}, {
        onSuccess: () => {
          toast.success("Task deleted successfully.");
          router.push(`/projects/${taskData.projectId}`);
        },
        onError: () => {
          toast.error("Error occured.");
        }
      });
    }
  }

  async function updateTask(){
    if(taskData){
      // Validate member
      if(selectedUsers.length === 0){
        toast.error("Must select at least one user to assign task to.");
        return;
      }

      // Get project due date
      const deadline = taskData.project.dueDate;
      const projDue = new Date(deadline);
      const taskDue = new Date(dueDate);
      if(taskDue > projDue){
        toast.error("Task due must be on or before the project deadline.");
        return;
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

      // Selected users
      const selectedUserIds = selectedUsers.map((s) => s.user.id);

      // Already task assignees
      const currentAssigneeIds = taskData.assignees.map((a) => a.userId);

      // New task assignees
      const newAssignees = selectedUsers.filter(
        (s) => !currentAssigneeIds.includes(s.user.id)
      );

      // Deleted task assignees
      const delAssignees = taskData.assignees.filter(
        (a) => !selectedUserIds.includes(a.userId)
      );

      try{
        // Create new task assignees
        for(const newAssignee of newAssignees){
          const newTaskAssignee: NewTaskAssignee = {
            taskId: taskData.id,
            userId: newAssignee.user.id,
          };
          await createTaskAssigneeMutation.mutateAsync(newTaskAssignee);
        }

        // Delete task assignees
        for(const delAssignee of delAssignees){
          await deleteTaskAssigneeMutation.mutateAsync(delAssignee.id);
        }
      }
      catch{
        toast.error("Error occured.");
        return;
      }

      // Object of updated task
      const updTask: Partial<typeof tasks.$inferInsert> = {
        title: title,
        description: description,
        dueDate: new Date(dueDate),
        priority: priority,
        label: label
      }
      
      // Update task
      updateTaskMutation.mutate({ projectId: taskData.projectId, taskId: taskData.id, updTask: updTask},{
        onError: () => {
          toast.error("Error occured.");
          return;
        }
      });   
      
      // Update project  
      updateProjectMutation.mutate({ projectId: taskData.project.id, updProject: { updatedAt: new Date() } },{
        onSuccess: () => {
          toast.success("Task created successfully.");
          setIsEditing(false);
        },
        onError: () => {
          toast.error("Error occured.");
        }
      });
    }        
  }

  // Show loading page if still processing
  if (!userLoaded || userIdLoading || taskDataLoading) return <LoadingPage/>;

  // Display error for queries
  if (userIdError || !userId) return <ErrorPage code={403} message="User not found"/>;
  if (taskDataError || !taskData) return <ErrorPage code={404} message="Task not found"/>;

  // Check if the user is member of the project
  const isMember = taskData.project.members.some((m) => m.userId === userId) ?? false;
  if(!isMember){
    return <ErrorPage code={403} message="Not a project member"/>;
  }

  // User role
  const role = taskData.project.members.find((m) => m.userId === userId)?.role as Role;
  const editTask = hasPermission(role, "editTask");
  const assignee = taskData.assignees.some((a) => a.userId === userId);
  const allowed = editTask || assignee;
  const editComment = hasPermission(role, "editComment");

  return(
		<DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl p-4 mx-auto lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => router.push(`/projects/${taskData.projectId}`)} 
              className="flex items-center px-4 py-2 space-x-2 text-gray-600 transition-colors dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-6 h-6 text-gray-500 transition-colors rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"/>
              <span>Back to Board</span>
            </button>
            {allowed ? (
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <X className="w-4 h-4"/>
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      disabled={deleteTaskMutation.isPending}
                      onClick={() => deleteTask()}
                      className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4"/>
                      <span>{deleteTaskMutation.isPending? "Deleting Task..." : "Delete Task"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={createTaskAssigneeMutation.isPending || deleteTaskAssigneeMutation.isPending || updateTaskMutation.isPending || updateProjectMutation.isPending}
                      className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
                      onClick={() => updateTask()}
                    >
                      <Save className="w-4 h-4"/>
                      <span>{createTaskAssigneeMutation.isPending ||deleteTaskAssigneeMutation.isPending || updateTaskMutation.isPending || updateProjectMutation.isPending? "Saving Changes..." : "Save Changes"}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-700 transition-colors bg-white border border-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="w-4 h-4"/>
                    <span>Edit Task</span>
                  </button>
                )}
              </div>
            ) : ""}
          </div>
          <div className="mb-8 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <div className="p-8">
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full pb-2 text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 dark:text-white focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {taskData.title}
                  </h1>
                )}
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                {isEditing ? (
                  <ReactQuill
                    value={description} onChange={setDescription}
                    className="w-full px-3 py-3 text-gray-900 border border-gray-300 resize-none dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  />
                ) : (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: taskData.description }}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Calendar className="inline w-4 h-4 mr-2"/>
                    Due Date
                  </label>
                  {isEditing ? (
                    <input
                      value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      type="datetime-local"
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div className="inline-flex items-center px-3 py-2 space-x-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-900 dark:text-white">
                        {DateTimeFormatter(taskData.dueDate)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Flag className="inline w-4 h-4 mr-2"/>
                    Priority
                  </label>
                  {isEditing ? (
                    <select
                      value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {PriorityArr.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${PriorityColor(taskData.priority)}`}>
                      <span className="capitalize">{taskData.priority}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Tag className="inline w-4 h-4 mr-2"/>
                    Label
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={label} onChange={(e) => setLabel(e.target.value)}
                      className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div className="inline-flex items-center px-3 py-2 space-x-1 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 rounded-xl">
                      <span>{taskData.label}</span>
                    </div>
                  )}
                </div>
              </div>
              {!isEditing? 
                <div className="mb-8">
                  <h4 className="flex items-center mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <UserRound className="w-4 h-4 mr-2"/>
                    {taskData.assignees.length > 1? "Assignees" : "Assignee" } ({taskData.assignees.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {taskData.assignees.map((assignee) => (
                      <div key={assignee.user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <UserAvatar clerkId={assignee.user.clerkId}/>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {assignee.user.fname} {assignee.user.lname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {assignee.user.email} - {taskData.project.members.find((m) => m.userId === assignee.userId)?.role}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              : "" }
              {isEditing && (
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add Assignees
                  </label>
                  <div className="relative">
                    <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500"/>
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={query} onChange={(e) => setQuery(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
              )}
              {isEditing && selectedUsers.length > 0 && (
                <div className="mb-8">
                  <h4 className="flex items-center mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <UserRound className="w-4 h-4 mr-2"/>
                    {selectedUsers.length > 1? "Assignees" : "Assignee" } ({selectedUsers.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {selectedUsers.map((assignee) => (
                      <div key={assignee.user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <UserAvatar clerkId={assignee.user.clerkId}/>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {assignee.user.fname} {assignee.user.lname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {assignee.user.email} - {assignee.role}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(assignee.user.id)}
                          className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 dark:text-red-400 hover:scale-110"
                        >
                          <UserMinus className="w-5 h-5"/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <CommentSection clerkId={user?.id ?? ""} userId={userId ?? ""} taskId={taskId ?? ""} editComment={editComment} allComments={taskData.comments}/>
        </div>
      </div>
		</DashboardLayout>
  );
}