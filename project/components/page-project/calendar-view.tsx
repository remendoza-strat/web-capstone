"use client"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { enUS } from "date-fns/locale"
import { Calendar, Views, dateFnsLocalizer, View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { Task } from "@/lib/db/schema"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LimitChar, PhDate, StripHTML } from "@/lib/utils"

// Handle formatting
const locales = { "en-US" : enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function CalendarView({ tasks } : { tasks: Task[] }){
  // Which view display
  const [view, setView] = useState<View>(Views.MONTH);

  // Current showing date
  const [date, setDate] = useState<Date>(new Date());

  // Going to task page
  const router = useRouter();

  // Map tasks to calendar events
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: PhDate(task.dueDate),
    end: PhDate(task.dueDate),
    allDay: false,
    description: StripHTML(task.description),
    resource: task
  }));

  // Task card style with color based on priority
  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    let backgroundColor = "#3B82F6";
    switch(task.priority){
      case "High":
        backgroundColor = "#dc2626";
        break;
      case "Medium":
        backgroundColor = "#ea580c";
        break;
      case "Low":
        backgroundColor = "#f59e0b";
        break;
    }
    return{
      style: {
        backgroundColor,
        borderRadius: "0.5rem",
        border: "none",
        color: "white",
        fontSize: "0.85rem",
        padding: "6px 8px",
        fontWeight: 500,
        whiteSpace: "normal",
        overflow: "visible",
        height: "auto"
      }
    }
  };

  // Task card content
  const CustomEvent = ({ event }: { event: any }) => {
    return(
      <div className="flex flex-col text-sm">
        <strong className="truncate">
          {LimitChar(event.title, 25)}
        </strong>
        <span className="text-xs opacity-90">
          {LimitChar(event.description, 40)}
        </span>
      </div>
    );
  };

  return(
    <div className="h-[95vh] bg-white dark:bg-gray-900 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <style>
        {`
          .rbc-toolbar { margin-bottom: 20px; color: rgb(55, 65, 81); }
          .dark .rbc-toolbar { color: rgb(229, 231, 235); }
          .rbc-toolbar-label { font-weight: 600; font-size: 1.25rem; color: rgb(55, 65, 81); }
          .dark .rbc-toolbar-label { color: rgb(229, 231, 235); }
          .rbc-toolbar button {
            background: white; border: 1px solid rgb(209, 213, 219); color: rgb(55, 65, 81);
            border-radius: 8px; padding: 8px 16px; margin: 0 2px; font-weight: 500; transition: all 0.2s;
          }
          .dark .rbc-toolbar button {
            background: rgb(55, 65, 81); border-color: rgb(75, 85, 99); color: rgb(229, 231, 235);
          }
          .rbc-toolbar button:hover { background: rgb(249, 250, 251); border-color: rgb(156, 163, 175); }
          .dark .rbc-toolbar button:hover { background: rgb(75, 85, 99); border-color: rgb(107, 114, 128); }
          .rbc-toolbar button.rbc-active { background: #3B82F6; color: white; border-color: #3B82F6; }
          .rbc-toolbar button.rbc-active:hover { background: #2563EB; border-color: #2563EB; }
          .rbc-header {
            padding: 12px 8px; font-weight: 600; color: rgb(55, 65, 81);
            background: rgb(249, 250, 251); border-color: rgb(229, 231, 235);
          }
          .dark .rbc-header { color: rgb(229, 231, 235); background: rgb(31, 41, 55); border-color: rgb(75, 85, 99); }
          .rbc-date-cell { padding: 8px; color: rgb(55, 65, 81); }
          .dark .rbc-date-cell { color: rgb(229, 231, 235); }
          .rbc-today { background-color: rgba(59, 130, 246, 0.05); }
          .dark .rbc-today { background-color: rgba(59, 130, 246, 0.2); }
          .rbc-show-more { color: #3B82F6; font-weight: 500; background: rgba(59, 130, 246, 0.05); border-radius: 4px; padding: 2px 6px; margin: 1px 0; }
          .rbc-show-more:hover { background: rgba(59, 130, 246, 0.1); }
          .rbc-agenda-view table { width: 100%; border-collapse: collapse; border-color: rgb(229, 231, 235); }
          .dark .rbc-agenda-view table { border-color: rgb(75, 85, 99); }
          .rbc-agenda-view .rbc-agenda-time-cell,
          .rbc-agenda-view .rbc-agenda-event-cell { padding: 8px; border-bottom: 1px solid rgb(229, 231, 235); white-space: normal; }
          .dark .rbc-agenda-view .rbc-agenda-time-cell,
          .dark .rbc-agenda-view .rbc-agenda-event-cell { border-bottom: 1px solid rgb(75, 85, 99); color: rgb(229, 231, 235); }
          .rbc-month-row .rbc-row-content { 
            height: auto !important; 
            min-height: 180px;
          }
          .rbc-event {
            display: block !important;
            white-space: normal !important;
            height: auto !important;
            min-height: 32px !important;
            padding: 6px 8px;
            line-height: 1.3rem;
            overflow: visible !important;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            color: white !important;
          }
          .rbc-day-slot .rbc-event,
          .rbc-time-slot .rbc-event {
            height: auto !important;
            min-height: 32px !important;
          }
          .rbc-event-content {
            white-space: normal !important;
            overflow: visible !important;
          }
          .rbc-time-gutter .rbc-timeslot-group {
            color: rgb(55, 65, 81);
          }
          .dark .rbc-time-gutter .rbc-timeslot-group {
            color: rgb(229, 231, 235);
          }
          .rbc-time-content .rbc-time-slot {
            color: rgb(55, 65, 81);
          }
          .dark .rbc-time-content .rbc-time-slot {
            color: rgb(229, 231, 235);
          }
          @media (max-width: 768px) {
            .rbc-toolbar {
              flex-direction: column;
              gap: 8px;
              text-align: center;
            }
            .rbc-toolbar-label {
              font-size: 1rem;
            }
            .rbc-toolbar button {
              padding: 6px 10px;
              font-size: 0.85rem;
            }
            .rbc-header {
              font-size: 0.85rem;
              padding: 8px 4px;
            }
            .rbc-date-cell {
              font-size: 0.8rem;
              padding: 4px;
            }
            .rbc-month-row .rbc-row-content { 
              min-height: 100px !important;
            }
            .rbc-event {
              font-size: 0.75rem !important;
              padding: 4px 6px !important;
              line-height: 1.1rem !important;
            }
            .rbc-agenda-view table {
              display: block;
              overflow-x: auto;
              white-space: nowrap;
            }
          }
          @media (max-width: 480px) {
            .rbc-toolbar { font-size: 0.8rem; }
            .rbc-toolbar button { padding: 4px 8px; }
            .rbc-toolbar-label { font-size: 0.9rem; }
            .rbc-event {
              font-size: 0.7rem !important;
              padding: 2px 4px !important;
            }
          }
        `}
      </style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        date={date}
        onView={(newView: View) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        eventPropGetter={eventStyleGetter}
        components={{ event: CustomEvent }}
        style={{ height: "100%" }}
        onSelectEvent={(event) => {
        if(event.id){
            router.push(`/task/${event.id}`);
          }
        }}
      />
    </div>
  );
}