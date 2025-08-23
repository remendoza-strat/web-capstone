"use client"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { useModal } from "@/lib/states"
import { Project } from "@/lib/db/schema"
import { pusherClient } from "@/lib/pusher/client"
import { ProjectData, TaskWithAssignees } from "@/lib/customtype"
import { KanbanTask } from "@/components/kanban/kanban-task"
import { KanbanUpdateTask } from "@/lib/hooks/projectMembers"
import { UpdateColumn } from "@/components/modal-extras/update-column"
import { AddColumn } from "@/components/modal-extras/add-column"

export function KanbanBoard({ userId, editProject, projectData } : { userId: string; editProject: boolean; projectData: ProjectData; }){
  // For values to display in board
  const [boardData, setBoardData] = useState<{
    columnNames: string[];
    tasks: TaskWithAssignees[];
  }>({
    columnNames: projectData?.columnNames || [],
    tasks: projectData?.tasks || []
  });

  // For kanban operations
  const [updateColumnIndex, setUpdateColumnIndex] = useState<number | null>(null);
  const [deleteColumnIndex, setDeleteColumnIndex] = useState<number | null>(null);
  const [createTaskIndex, setCreateTaskIndex] = useState<number | null>(null);
  
  // Modal opening and closing
  const { isOpen, modalType, openModal } = useModal();

  // Updating task position
  const updateMutation = KanbanUpdateTask();

  // Active task
  const [activeTask, setActiveTask] = useState<TaskWithAssignees | null>(null);

  // Pusher socket
  useEffect(() => {

    // Subscribe to channel of the project
    const channel = pusherClient.subscribe(`kanban-channel-${projectData.id}`);

    // Listen for events
    channel.bind("kanban-update", (data: { task?: TaskWithAssignees; project?: Project }) => {
      setBoardData((prev) => {
        let updated = { ...prev };

        // Handle task update if provided
        if(data.task){
          const exists = updated.tasks.some((t) => t.id === data.task!.id);
          updated.tasks = exists
            ? updated.tasks.map((t) => (t.id === data.task!.id ? data.task! : t))
            : [...updated.tasks, data.task!];
        }

        // Handle project update if provided
        if(data.project){
          updated.columnNames = [...data.project.columnNames];
        }

        // Return the updates
        return updated;
      });
    });

    // Cleanup
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`kanban-channel-${projectData.id}`);
    };
  }, [projectData.id]);

  // Handle when drag action ends
  function handleDragEnd(event: any){

    // Get dragged task and dropped area
    const { active, over } = event;

    // Invalid drop
    if (!over) return;

    // Dragged task and dropped area
    const activeId = active.id as string;
    const overId = over.id as string;

    // Dropped to self
    if (activeId === overId) return;

    // Find data of task being dragged
    const activeTask = boardData.tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    // Block drag if current user is not an assignee or have no permission
    const isAssignee = activeTask.assignees?.some((a) => a.userId === userId);
    if (!isAssignee && !editProject) return;

    // Set initial destination column
    let destColumn = activeTask.position;

    // If dropped in column, get column index
    if(overId.startsWith("column-")){
      destColumn = Number(overId.replace("column-", ""));
    } 

    // If dropped in task, get column of the task
    else{
      const overTask = boardData.tasks.find((task) => task.id === overId);
      if (!overTask) return;
      destColumn = overTask.position;
    }

    // Copy of all tasks
    const updatedTasks = [...boardData.tasks];

    // Copy of all tasks without the task being dragged
    const withoutActive = updatedTasks.filter((t) => t.id !== activeId);

    // Same column drop
    if(activeTask.position === destColumn){ 

      // Get all tasks of column, without the active task, and order
      const colTasks = boardData.tasks
        .filter((task) => task.position === destColumn && task.id !== activeId)
        .sort((a, b) => a.order - b.order);

      // Dropped in another task
      if(!overId.startsWith("column-")){
        
        // Get dropped onto task
        const newIndex = colTasks.findIndex((task) => task.id === overId);

        // Insert dragged task
        colTasks.splice(newIndex, 0, activeTask);
      } 

      // Dropped on the bottom
      else{
        
        // Add active task on last
        colTasks.push({ ...activeTask, order: colTasks.length });
      }

      // Update order
      colTasks.forEach((task, index) => {
        task.order = index;
        updateMutation.mutate({
          projectId: projectData.id,
          taskId: task.id,
          updTask: { order: index }
        });
      });

      // Update board state
      setBoardData((prev) => ({
        ...prev,
        tasks: prev.tasks.map(
          (task) => colTasks.find((t) => t.id === task.id) || task)
      }));
    } 

    // Different column drop
    else{
    
    // Tasks of column of task dragged
    const sourceCol = withoutActive
      .filter((task) => task.position === activeTask.position)
      .sort((a, b) => a.order - b.order);

    // Tasks of destination column
    const destCol = withoutActive
      .filter((task) => task.position === destColumn)
      .sort((a, b) => a.order - b.order);

    // Dragged in column, push the task
    if(overId.startsWith("column-")){
      destCol.push({
        ...activeTask,
        position: destColumn,
        order: destCol.length
      });
    } 

    // Dragged in task
    else{
      const insertIndex = destCol.findIndex((task) => task.id === overId);
      const index = insertIndex === -1 ? destCol.length : insertIndex;
      destCol.splice(index, 0, {
          ...activeTask,
          position: destColumn,
          order: index
        });
      }

      // Update order of source column
      sourceCol.forEach((task, index) => {
        task.order = index;
        updateMutation.mutate({
          projectId: projectData.id,
          taskId: task.id,
          updTask: { order: index }
        });
      });

      // Update order of destination column
      destCol.forEach((task, index) => {
        task.order = index;
        task.position = destColumn;
        updateMutation.mutate({
          projectId: projectData.id,
          taskId: task.id,
          updTask: { position: task.position, order: index }
        });
      });

      // Merge updated tasks
      const merged = updatedTasks.map((task) => {

        // Update affected task in source
        const inSource = sourceCol.find((source) => source.id === task.id);
        if (inSource) return { ...task, order: inSource.order, position: inSource.position };

        // Update affected task in destination
        const inDest = destCol.find((des) => des.id === task.id);
        if (inDest) return { ...task, order: inDest.order, position: inDest.position };

        // Return task
        return task;
      });

      // Update task
      setBoardData((prev) => ({
        ...prev,
        tasks: merged
      }));
    }
  }

  return(
    <div>
      {isOpen && modalType === "addColumn" && <AddColumn
        columnNames={boardData.columnNames} 
        projectId={projectData.id}/>
      }
      {isOpen && modalType === "updateColumn" && updateColumnIndex !== null && <UpdateColumn
        columnIndex={updateColumnIndex} 
        columnNames={boardData.columnNames} 
        projectId={projectData.id}/>
      }
      <div>
        <DndContext
          onDragStart={(event) => {
            const task = event.active.data.current?.task as TaskWithAssignees;
            if (task) setActiveTask(task);
          }}
          onDragEnd={(event) => {
            handleDragEnd(event);
            setActiveTask(null);
          }}
          onDragCancel={() => setActiveTask(null)}
        >
          <div className="flex pb-4 space-x-6 overflow-x-auto h-[calc(100vh-120px)]">
            {boardData.columnNames.map((columnTitle, columnIndex) => {
              const columnTasks = boardData.tasks
                .filter((task) => task.position === columnIndex)
                .sort((a, b) => a.order - b.order);
              return(
                <SortableContext
                  key={columnIndex}
                  items={columnTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    id={`column-${columnIndex}`}
                    title={columnTitle}
                    tasks={columnTasks}
                    userId={userId}
                    editProject={editProject}
                    onUpdateColumn={() => setUpdateColumnIndex(columnIndex)}
                    onDeleteColumn={() => setDeleteColumnIndex(columnIndex)}
                    onCreateTask={() => setCreateTaskIndex(columnIndex)}
                  />
                </SortableContext>
              );
            })}
            {editProject && (
              <button
                type="button"
                onClick={() => {
                  openModal("addColumn");
                }} 
                className="flex-shrink-0 p-3 text-gray-500 transition-colors border-2 border-gray-300 border-dashed w-80 dark:text-gray-400 dark:border-gray-600 rounded-xl hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400"
              >
                <Plus className="w-5 h-5 mx-auto mb-1"/>
                <span className="text-sm">Add Column</span>
              </button>
            )}
          </div>
          <DragOverlay>
            {activeTask ? <KanbanTask task={activeTask} userId={userId} editProject={editProject} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}