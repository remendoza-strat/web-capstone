"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Users, Pencil, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { UpdateProject } from "@/components/projects-modal/update";
import { DeleteProject } from "@/components/projects-modal/delete";
import { useModal } from "@/lib/states";
import { hasPermission } from "@/lib/permissions";
import { ProjectsWithTasks, Role, UserProjects } from "@/lib/customtype";
import { DateTimeFormatter } from "@/lib/utils";
import { KanbanBoard } from "@/components/kanban-board";

export default function ProjectMainPage({userId, projectData} : {userId: string, projectData: UserProjects}){
  const role: Role = projectData.members.find((m) => m.userId === userId)?.role as Role;
  const editProject = (hasPermission(role, "editProject"));
	const { isOpen, modalType, openModal } = useModal();
  const projectWithTasks: ProjectsWithTasks = (({ members, ...rest }) => rest)(projectData);

   
  return (
    <DashboardLayout>
      {isOpen && modalType === "updateProject" && <UpdateProject projectData={projectWithTasks}/>}
      {isOpen && modalType === "deleteProject" && <DeleteProject projectId={projectData.id}/>}

      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-4">
            <Link
              href="/projects"
              className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
                {projectData.name}
              </h1>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                {projectData.description}
              </p>
              <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
                {DateTimeFormatter(projectData.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Calendar size={20} />
            </button>
            <button className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors">
              <Users size={20} />
            </button>
            {editProject && (
              <>
                <button
                  className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
                  onClick={() => openModal("updateProject")}
                >
                  <Pencil size={20} />
                </button>
                <button
                  className="p-2 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
                  onClick={() => openModal("deleteProject")}
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>

        </div>


        <KanbanBoard editProject={editProject} projectData={projectData}/>

      </div>

    </DashboardLayout>
  );
}