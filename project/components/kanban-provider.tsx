"use client"
import { createContext, useContext, ReactNode } from "react"
import { ProjectsWithTasks } from "@/lib/customtype"

// Props values
interface KanbanContextProps {
  editProject: boolean;
  projectData: ProjectsWithTasks;
}

// Create context
const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

// Wrap children
export function KanbanProvider({ editProject, projectData, children } : KanbanContextProps & { children: ReactNode }){
  return(
    <KanbanContext.Provider value={{ editProject, projectData }}>
      {children}
    </KanbanContext.Provider>
  );
}

// Access context
export function useKanbanContext(){
  const context = useContext(KanbanContext);
  if (!context) throw new Error("Kanban provider error");
  return context;
}