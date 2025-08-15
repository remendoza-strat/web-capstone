"use client"
import "../globals.css"
import { toast } from "sonner"
import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useModal } from "@/lib/states"
import { deleteProject } from "@/lib/hooks/projects"
import { ProjectSchema } from "@/lib/validations"

export function LeaveProject({ projectId, userId, projectName} : {projectId: string; userId: string; projectName: string }){
  const { closeModal } = useModal();
  const [code, setCode] = useState("");
  const deleteMutation = deleteProject();
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // try{
    //   // Validate input
    //   const result = ProjectSchema.safeParse({ projectDeleteCode: code });

    //   // Display error from validation
    //   if(!result.success){
    //     const errors = result.error.flatten().fieldErrors;
    //     if(errors.projectDeleteCode?.[0]){
    //       toast.error(errors.projectDeleteCode[0]);
    //       return;
    //     }
    //   }

    //   // Delete project
    //   deleteMutation.mutate(projectId, {
    //     onSuccess: () => {
    //       closeModal();
    //       router.push("/projects");
    //       toast.success("Project deleted successfully.");
    //     },
    //     onError: () => {
    //       closeModal();
    //       toast.error("Error occured.");
    //     }
    //   });
    // }
    // catch{return} 
  }

  return(
    <div className="modal-background">
      <div className="max-w-md modal-form">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Leave Group
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="modal-form-label">
                Are you sure you want to leave "{projectName}"? You will lose access to all tasks, discussions, and updates for this group.
            </label>
          </div>
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending? "Deleting..." : "Leave Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}