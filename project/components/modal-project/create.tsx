"use client"
import { useState } from "react"
import { Calendar, FileText, Type, X } from "lucide-react"
import { toast } from "sonner"
import type { NewProject, NewProjectMember } from "@/lib/db/schema"
import { ProjectSchema } from "@/lib/validations"
import { useModal } from "@/lib/states"
import { createProject, createProjectMember } from "@/lib/db/tanstack"

export function CreateProject({ userId } : {  userId: string }){
  // Closing modal
  const { closeModal } = useModal();
    
  // Create project and member
  const createProjectMutation = createProject(userId);
  const createProjectMemberMutation = createProjectMember(userId);
		
  // Hooks for input
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const result = ProjectSchema.safeParse({
      name,
      description,
      dueDate
    });

    // Display error from validation
    if(!result.success){
      const errors = result.error.flatten().fieldErrors;
      if(errors.name?.[0]){
        toast.error(errors.name[0]);
        return;
      }
      if(errors.description?.[0]){
        toast.error(errors.description[0]);
        return;
      }
      if(errors.dueDate?.[0]){
        toast.error(errors.dueDate[0]);
        return;
      }
    }
    
    // Create object of new project
    const newProject: NewProject = {
      name: name,
      description: description,
      dueDate: new Date(dueDate),
      columnCount: 5,
      columnNames: ["Backlog", "This Week", "In Progress", "To Review", "Done"]
    };

    try{
      // Create project
      const projectId = await createProjectMutation.mutateAsync({ newProject });

      // Create object of new project member
      const newProjectMember: NewProjectMember = {
        projectId: projectId,
        userId: userId,
        role: "Project Manager",
        approved: true
      }

      // Create project member
      await createProjectMemberMutation.mutateAsync({ newProjectMember });

      // Display success
      toast.success("Project created successfully.");
      closeModal();
    } 
    catch{
      toast.error("Error occured.");
      closeModal();
    }
  };

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
      <div className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Project
            </h2>
          <button
            type="button"
            onClick={closeModal}
            className="p-2 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Type className="inline w-4 h-4 mr-2"/>
              Project Name
            </label>
            <input
							value={name} onChange={(e) => setName(e.target.value)}
              type="text" placeholder="Enter project name"
							className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="inline w-4 h-4 mr-2"/>
              Description
            </label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="Enter project description"
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 resize-none dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="inline w-4 h-4 mr-2"/>
              Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-3 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex pt-4 space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProjectMutation.isPending || createProjectMemberMutation.isPending}
              className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {createProjectMutation.isPending || createProjectMemberMutation.isPending? "Creating Project..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}