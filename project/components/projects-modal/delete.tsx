"use client"
import "../globals.css"
import { X } from "lucide-react"

import { useModal } from "@/lib/states"

export default function DeleteProject() {
  const { closeModal } = useModal()

 return(
    <div className="modal-background">
      <div className="max-w-md modal-form">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            Delete Project
          </h3>
          <button onClick={closeModal} className="modal-sub-btn">
            <X size={20}/>
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="modal-form-label">
              Type "DELETE THIS PROJECT" to proceed
            </label>
            <input
              type="text" placeholder=""
              className="modal-form-input"
            />
          </div>
          <div className="modal-btn-div">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              Delete Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
