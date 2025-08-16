import { create } from "zustand"

// Structure of modal state
interface ModalState {
  isOpen: boolean,
  modalType: string | null,
  openModal: (type: string) => void,
  closeModal: () => void
}

export const useModal = create<ModalState>((set) => ({
  // Set initial values
  isOpen: false,
  modalType: null,

  // Functions for open and closing
  openModal: (type) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null })
}));