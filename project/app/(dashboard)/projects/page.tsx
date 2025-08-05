"use client"
import { Plus, Search, Filter, Users, SquareCheckBig, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserIdAction, getUserProjectsAction } from "@/lib/db/actions";
import { UserProjects, Role } from '../../../lib/customtype';
import { RoleArr } from "../../../lib/customtype";
import { ProjectGrid } from "@/components/project-grid";
import { ProjectsByStatus, ProjectsByDueDate, ProjectsByRole } from "@/lib/utils"

export default function ProjectsPage() {
  const { user } = useUser();
  const [userProjs, setUserProjs] = useState<UserProjects[]>([]);
  const [search, setSearch] = useState("");
  const [filteredProjs, setFilteredProjs] = useState<UserProjects[]>([]);
  const [filterBtn, setFilterBtn] = useState(false);

  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if(!user) return;

      const clerkId = user.id;
      if(!clerkId) return;

      const userId = await getUserIdAction(clerkId);
      if(!userId) return;
      setUserId(userId);

      const userProjs = await getUserProjectsAction(userId);
      setUserProjs(userProjs);
      setFilteredProjs(userProjs);
    }
    fetchData();
  }, [user])

  useEffect(() => {
    const query = search.toLowerCase();

    let result: UserProjects[] = []
    
    result = userProjs.filter((p) => 
      (p.name).toLowerCase().includes(query) ||
      (p.description).toLowerCase().includes(query)
    )

    result = ProjectsByStatus(status, result);
    result = ProjectsByDueDate(dueDate, result);
    result = ProjectsByRole(userId, role, result);

    setFilteredProjs(result);
  }, [search, status, dueDate, role]);


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">Projects</h1>
            <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">Manage and organize your team projects</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-blue_munsell-500 hover:bg-blue_munsell-600">
            <Plus size={20} className="mr-2" />
            New Project
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute transform -translate-y-1/2 left-3 top-1/2 text-payne's_gray-500 dark:text-french_gray-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search projects..."
              className="w-full py-2 pl-10 pr-4 bg-white border dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
            />
          </div>
          <button onClick={() => setFilterBtn(!filterBtn)} className="inline-flex items-center px-4 py-2 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>

        {filterBtn && (
            <div className="flex justify-between border page-card">
              <div className="w-full p-3 md:w-64">
                <p className="p-2 page-sub-text">By Status:</p>
                <select 
                  value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 page-select-bg">
                  <option value="">All Status</option>
                  <option value="done">Done</option>
                  <option value="active">Active</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="w-full p-3 md:w-64">
                <p>By Your Role:</p>
                <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500">
                  <option value="">All Roles</option>
                  {RoleArr.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full p-3 md:w-64">
                <p>By Due Date:</p>
                <select value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500">
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          )}

        <ProjectGrid filteredProjs={filteredProjs}/>

   
      </div>
    </DashboardLayout>
  )
}
