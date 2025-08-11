"use client"
import { useEffect, useState } from "react"
import { DndContext } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanColumn } from "@/components/kanban-column"
import { updateTask } from "@/lib/hooks/tasks"
import { UserProjects } from "@/lib/customtype"
import { useModal } from "@/lib/states"
import { CreateColumn } from "@/components/columns-modal/create"

export function KanbanBoard({ projectData } : { projectData: UserProjects }){
  const columnNames = projectData.columnNames;
  const tasks = projectData.tasks;
  const { isOpen, modalType, openModal } = useModal();

  // To update task position and order
  const updateTaskMutation = updateTask();
  
  // Display of column names and tasks
  const [boardData, setBoardData] = useState({ columnNames, tasks });

  // Update when new data is created
  useEffect(() => {
    setBoardData({ columnNames, tasks });
  }, [columnNames, tasks]);

  // Handle task movements
  function handleDragEnd(event: any){
    const { active, over } = event;

    // Task is dragged outside the board
    if (!over) return;

    // Id of task dragged
    const activeId = active.id as string;

    // Id of column or task dragged onto
    const overId = over.id as string;

    // No change in task dragged position
    if (activeId === overId) return;

    // Get the task dragged
    const activeTask = boardData.tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    // Set default column destination
    let destColumn = activeTask.position;

    // Task dragged in column
    if(overId.startsWith("column-")){
      destColumn = Number(overId.replace("column-", ""));
    } 
    // Task dragged in task
    else {
      const overTask = boardData.tasks.find((task) => task.id === overId);
      if (!overTask) return;
      destColumn = overTask.position;
    }

    // Copy tasks
    const updatedTasks = [...boardData.tasks];
    
    // Tasks without the dragged task
    const withoutActive = updatedTasks.filter((t) => t.id !== activeId);

    // Same column reordering
    if(activeTask.position === destColumn){
      // Dropped onto the column
      if(overId.startsWith("column-")){
        // Get column tasks but exclude the dragged task
        const colTasks = boardData.tasks
          .filter((task) => task.position === destColumn && task.id !== activeId)
          .sort((a, b) => a.order - b.order);

        // Put the dragged task at the end
        const moved = { ...activeTask, order: colTasks.length };
        colTasks.push(moved);

        // Update database
        colTasks.forEach((task, index) => {
          task.order = index;
          updateTaskMutation.mutate({ taskId: task.id, updTask: { order: index } });
        });

        // Update display
        setBoardData((prev) => ({...prev, tasks: prev.tasks.map((task) => task.id === activeTask.id
              ? { ...task, order: colTasks.length - 1 }
              : colTasks.find((ctask) => ctask.id === task.id) || task)
        }));
      }
      // Dropped onto the task
      else{
        // Get column tasks
        const colTasks = boardData.tasks
          .filter((task) => task.position === destColumn)
          .sort((a, b) => a.order - b.order);

        // Get old and new task task index
        const oldIndex = colTasks.findIndex((task) => task.id === activeId);
        const newIndex = colTasks.findIndex((task) => task.id === overId);

        // Remove and add the dragged task
        const reordered = [...colTasks];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        // Update database
        reordered.forEach((task, index) => {
          task.order = index;
          updateTaskMutation.mutate({ taskId: task.id, updTask: { order: index } });
        });

        // Update display
        setBoardData((prev) => ({...prev, tasks: prev.tasks.map((task) => 
          reordered.find((rtask) => rtask.id === task.id) || task)
        }));
      } 
    }
    // Different column
    else{
      // Tasks in the original column
      const sourceCol = withoutActive
        .filter((task) => task.position === activeTask.position)
        .sort((a, b) => a.order - b.order);

      // Task in the destination column
      const destCol = withoutActive
        .filter((task) => task.position === destColumn)
        .sort((a, b) => a.order - b.order);

      // If dragged on column, then append the task
      if(overId.startsWith("column-")){
        destCol.push({ ...activeTask, position: destColumn, order: destCol.length });
      } 
      // If dragged on task, insert it before the task
      else{
        const insertIndex = destCol.findIndex((task) => task.id === overId);
        const index = insertIndex === -1 ? destCol.length : insertIndex;
        destCol.splice(index, 0, { ...activeTask, position: destColumn, order: index });
      }

      // Update order for database of original column
      sourceCol.forEach((task, index) => {
        task.order = index;
        updateTaskMutation.mutate({ taskId: task.id, updTask: { order: index } });
      });

      // Update order for database of destination column
      destCol.forEach((task, index) => {
        task.order = index;
        task.position = destColumn;
        updateTaskMutation.mutate({ taskId: task.id, updTask: { position: task.position, order: index } });
      });

      // Update the list
      const merged = updatedTasks.map((task) => {
    
        // If task is in original column, get the updated order and position
        const inSource = sourceCol.find((source) => source.id === task.id);
        if (inSource) return { ...task, order: inSource.order, position: inSource.position };

        // If task is in destination column, get the updated order and position
        const inDest = destCol.find((des) => des.id === task.id);
        if (inDest) return { ...task, order: inDest.order, position: inDest.position };

        // Return task
        return task;
        
      });

      // Update order for display
      setBoardData((prev) => ({
        ...prev,
        tasks: merged
      }));
    }
  }



  return (
    <div>
      {isOpen && modalType === "columnProject" && <CreateColumn projectData={projectData}/>}
    <div className="p-6 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-gray-400">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex pb-4 space-x-6 overflow-x-auto">
          {boardData.columnNames.map((columnTitle, columnIndex) => {
            const columnTasks = boardData.tasks
              .filter((task) => task.position === columnIndex)
              .sort((a, b) => a.order - b.order);

            return (
              <SortableContext
                key={columnIndex}
                items={columnTasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <KanbanColumn
                  id={`column-${columnIndex}`}
                  title={columnTitle}
                  tasks={columnTasks}
                />
              </SortableContext>
            );
          })}

          <button
          onClick={() => openModal("columnProject")}
          className="flex-shrink-0 p-3 border-2 border-dashed rounded-lg w-80 border-french_gray-300 dark:border-gray-400 text-payne's_gray-500 dark:text-french_gray-400 hover:border-blue_munsell-500 hover:text-blue_munsell-500 transition-colors">
            + Add Column
          </button>
        </div>
      </DndContext>
    </div>
    </div>
  );
}