"use client"
import "../globals.css"

import { useModal } from "@/lib/states"

export default function UpdateProject() {
  const { closeModal } = useModal()

 return(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open-bg">
      <div className="w-full max-w-md p-6 mx-4 rounded-lg modal-form-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="modal-form-title">
            PROJECT UPDATE
          </h3>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block m-2 modal-form-label">
              Name
            </label>
            <input
              type="text" placeholder="Enter project name"
              className="w-full modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Description
            </label>
            <textarea
              rows={3} placeholder="Enter project description"
              className="w-full modal-form-input"
            />
          </div>
          <div>
            <label className="block m-2 modal-form-label">
              Due Date
            </label>
            <input
              type="datetime-local"
              className="w-full cursor-pointer modal-form-input"
            />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button onClick={closeModal} type="button" className="modal-sub-btn">
              Cancel
            </button>
            <button type="submit" className="modal-main-btn">
              PROJECT UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
