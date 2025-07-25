"use client"
import { useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import { createProjectAction, getUserIdAction } from "@/lib/db/actions"
import type { NewProject } from "@/lib/db/schema"
import { ProjectSchema } from "@/lib/validations"



export function CreateProjectButton({ close } : { close: () => void }){
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clerkId = user!.id;
    const ownerId = (await getUserIdAction(clerkId))!;

    const result = ProjectSchema.safeParse({
      name,
      description,
      dueDate
    });

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

      toast.error("Invalid input. Please check your form.");
      return;
  }

    const newProject: NewProject = {
      ownerId,
      name,
      description,
      dueDate: new Date(dueDate)
    };

    toast.success("Project created.");
    await createProjectAction(newProject);
    close();
  };

  return (
    <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg dark:bg-outer_space-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500">Create New Project</h3>
              <button
                onClick={close}
                className="p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                  Project Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
                  placeholder="Project description"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                  Due Date
                </label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
                />
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 text-payne's_gray-500 dark:text-french_gray-400 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition-colors rounded-lg bg-blue_munsell-500 hover:bg-blue_munsell-600"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
  
}
