"use client";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, Views, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";

import { Task } from "@/lib/db/schema";

function toPHDate(date: Date | null): Date | null {
  if (!date) return null;
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 8 * 60 * 60000); 
}


export function StripHTML(html: string): string{
    return html.replace(/<[^>]+>/g, "").trim();
}
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export function CalendarView({ tasks }: { tasks: Task[] }) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

  const events = tasks.map((task) => ({
    title: task.title,
    start: toPHDate(task.dueDate)!, 
    end: toPHDate(task.dueDate)!,
    allDay: false,
    description: StripHTML(task.description)
  }));

  return (
    <div className="h-[80vh] bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
<Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: "100%" }}
  view={view}
  date={date}
  onView={(newView: View) => setView(newView)}
  onNavigate={(newDate) => setDate(newDate)}
  views={[Views.MONTH, Views.WEEK, Views.DAY]}
  defaultView={Views.MONTH}
  eventPropGetter={(event) => {
    const isOverdue = event.start < new Date();
    return {
      style: {
        backgroundColor: isOverdue ? "#ef4444" : "#3b82f6",
        borderRadius: "0.5rem",
        color: "white",
        border: "none",
      },
    };
  }}
  components={{
    event: ({ event }) => (
      <div>
        <strong>{event.title}</strong>
        {event.description && (
          <div style={{ fontSize: "0.8em" }}>{event.description}</div>
        )}
      </div>
    ),
  }}
/>

    </div>
  );
}
