import type { Task } from "@/lib/db/schema"

// Remove tags from input
export function StripHTML(html: string): string{
  return html.replace(/<[^>]+>/g, "").trim();
}

// Limit character to display
export function LimitChar(paragraph: string, limit: number): string{
  if(paragraph.length <= limit){
    return paragraph;
  }
  return paragraph.slice(0, limit) + "...";
}

export function ComputeProgress(tasks: Task[]): number{
  var total = 0;
  const taskCount = tasks.length;

  if (taskCount == 0) return 0;

  for(const t of tasks){
    const position = t.position;
    const column = t.columnCount;

    if(position == 100){
      total += 100;
    }
    else{
      total += column == 0? 0 : Math.round((position/column) * 100);
    }
  }

  return Math.round(total/taskCount);
}

export function DaysLeft(date: Date){
  if (!date) return [];
  const now = new Date();

  const dueDateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const curDateUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const daysDiff = Math.floor((dueDateUTC - curDateUTC) / (1000 * 60 * 60 * 24));

  if(daysDiff < 0){
    const display = (daysDiff * 1) + " days overdue";
    return ["overdue", display];
  }
  else if(daysDiff == 0){
    return ["active", "Due date today"];
  }
  else{
    const display = daysDiff == 1? "1 day left" : daysDiff + " days left";
    return ["active", display];
  }
}

// Format date for display
export function DateTimeFormatter(date: Date | string | null): string{
  const backup = new Date();
  if(!date) return String(backup);
  
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