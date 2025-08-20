import type { Task } from "@/lib/db/schema"
import { UserProjects } from "@/lib/customtype"

// Remove html tags from text
export function StripHTML(html: string){
  return html.replace(/<[^>]+>/g, "").trim();
}



// Get status of the project
export function ProjectStatus(tasks: Task[], columnCount: number, date: Date){
  const done = tasks.every((task) => task.position === (columnCount - 1));
  if (done && tasks.length !== 0) return ["done", "Project done"];
  
  const now = new Date();
  const dueDateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const curDateUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysDiff = Math.floor((dueDateUTC - curDateUTC) / (1000 * 60 * 60 * 24));

  if(daysDiff < 0){
    const display = daysDiff === -1? "1 day overdue" : (daysDiff * -1) + " days overdue";
    return ["overdue", display];
  }
  else if(daysDiff === 0){
    const milliDiff = date.getTime() - now.getTime();
    if(milliDiff < 0){
      return ["overdue", "Past due today"];
    }
    return ["active", "Due date today"];
  }
  else{
    const display = daysDiff === 1? "1 day left" : daysDiff + " days left";
    return ["active", display];
  }
}



// Sort projects by status
export function ProjectsByStatus(status: string, result: UserProjects[]){
  if(status === "done"){
    result = result.filter((p) => 
      p.tasks.length !== 0 && p.tasks.every((t) => t.position === (p.columnCount - 1))
    );
  }
  else if(status === "active"){
    result = result.filter((p) => {
      const milliDiff = p.dueDate.getTime() - (new Date()).getTime();
      return milliDiff >= 0;
    });
  }
  else if(status === "overdue"){
    result = result.filter((p) => {
      const milliDiff = p.dueDate.getTime() - (new Date()).getTime();
      return milliDiff < 0 && p.tasks.every((t) => t.position !== (p.columnCount - 1));
    });
  }
  return result;
}

// Sort projects by due date
export function ProjectsByDueDate(dueDate: string, result: UserProjects[]){
  if(dueDate === "today"){
    result = result.filter((p) => {
      const due = new Date(p.dueDate);
      const now = new Date();

      return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth() && due.getDate() === now.getDate();
    });
  }
  else if(dueDate === "week"){
    result = result.filter((p) => {
      const due = new Date(p.dueDate);
      const now = new Date();

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return due >= startOfWeek && due <= endOfWeek;
    })
  }
  else if(dueDate === "month"){
    result = result.filter((p) => {
      const due = new Date(p.dueDate);
      const now = new Date();

      return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth();
    });
  }
  return result;
}

// Sort projects by user role
export function ProjectsByRole(userId: string, role: string, result: UserProjects[]){
  if(role){
    result = result.filter((p) => 
      p.members.some((m) => m.userId === userId && m.role === role)
    );
  }
  return result;
}

// Convert date to PH timezone for display
export const FormatDateDisplay = (date: Date) => {
  const display = new Date(date);

  const phOffset = 8 * 60;
  const localDate = new Date(display.getTime() + phOffset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};




























// Sort projects by most recent updated
export function ByRecentProjects(projects: UserProjects[]){
  const recent = [...projects].sort((a, b) =>
    new Date(b.updatedAt?? 0).getTime() - new Date(a.updatedAt?? 0).getTime()
  );
  return recent;
}

// Cut sentence based on characters count
export function LimitChar(paragraph: string, limit: number){
  if(paragraph.length <= limit){
    return paragraph;
  }
  return paragraph.slice(0, limit) + "...";
}

// Format date
export function DateTimeFormatter(date: Date){
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const phTime = new Date(utc + 8 * 60 * 60 * 1000);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[phTime.getMonth()];
  const day = phTime.getDate();
  const year = phTime.getFullYear();

  let hours = phTime.getHours();
  const minutes = phTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${day}, ${year} at ${hours}:${paddedMinutes}${ampm}`;
}

// Calculate progress per project tasks
export function ComputeProgress(tasks: Task[], columnCount: number){
  if (tasks.length === 0) return 0;

  var total = 0;
  const taskCount = tasks.length;

  for(const t of tasks){
    const position = t.position;
    const column = columnCount;

    if(position === (columnCount - 1)){
      total += 100;
    }
    else{
      total += Math.round((position/column) * 100);
    }
  }

  return Math.round(total/taskCount);
}

// Get color of progress bar
export function ProgressColor(progress: number){
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-500";
  return "bg-red-500";
};