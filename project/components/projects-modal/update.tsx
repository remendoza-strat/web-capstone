"use client"
import "../globals.css"
import { X } from "lucide-react"
import { useModal } from "@/lib/states"

export default function UpdateProject() {
  const { closeModal } = useModal()

  return(
    <div className="modal-background">
      <div className="max-w-md modal-form">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Update Project
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="modal-form-label">
              Name
            </label>
            <input
              type="text" placeholder="Enter project name"
              className="modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              Description
            </label>
            <textarea
              rows={3} placeholder="Enter project description"
              className="modal-form-input"
            />
          </div>
          <div>
            <label className="modal-form-label">
              Due Date
            </label>
            <input
              type="datetime-local"
              className="cursor-pointer modal-form-input"
            />
          </div>
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
