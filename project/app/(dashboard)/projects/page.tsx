"use client"
import { Search, Filter, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useUser } from "@clerk/nextjs"
import { getUserIdAction, getUserProjectsAction } from "@/lib/db/actions"
import { UserProjects, RoleArr } from "@/lib/customtype"
import { ProjectGrid } from "@/components/project-grid"
import { ProjectsByStatus, ProjectsByDueDate, ProjectsByRole } from "@/lib/utils"
import { CreateProjectButton } from "@/components/create-project-button"

export default function ProjectsPage(){
  // Create project modal
  const [isOpen, setIsOpen] = useState(false);
  
  // Getting clerkId of user
  const { user } = useUser();
  const [userId, setUserId] = useState("");

  // Projects filtering and state of input and selects input
  const [userProjs, setUserProjs] = useState<UserProjects[]>([]);
  const [filteredProjs, setFilteredProjs] = useState<UserProjects[]>([]);
  const [filterBtn, setFilterBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    try{
      const fetchData = async () => {
        // Getting clerkId
        if (!user) return;
        const clerkId = user.id;
        if (!clerkId) return;

        // Getting userId
        const userId = await getUserIdAction(clerkId);
        if (!userId) return;
        setUserId(userId);

        // Getting user projects and its data
        const userProjs = await getUserProjectsAction(userId);
        setUserProjs(userProjs);
        setFilteredProjs(userProjs);
      }
      fetchData();
    } catch{return}
  }, [user, isOpen]);

  useEffect(() => {
    const delay = setTimeout(() => {
      // Setup query input and storage of filtered projects
      const query = search.toLowerCase();
      let result: UserProjects[] = []
      
      // Filter projects with query
      result = userProjs.filter((p) => 
        (p.name).toLowerCase().includes(query) ||
        (p.description).toLowerCase().includes(query)
      );

      // Allow filter with selects input when activated
      if(filterBtn === true){
        result = ProjectsByStatus(status, result);
        result = ProjectsByDueDate(dueDate, result);
        result = ProjectsByRole(userId, role, result);
      }

      // Set value of filtered projects
      setFilteredProjs(result);
    }, 200);
    return () => clearTimeout(delay);
  }, [search, status, dueDate, role, filterBtn]);

  return(
    <DashboardLayout>
      {isOpen && (
        <CreateProjectButton close={() => setIsOpen(false)} userId={userId}/>
      )}   
      <button onClick={() => setIsOpen(true)} className="fixed flex items-center p-3 rounded-full bottom-7 right-7 modal-main-btn">
        <Plus size={25} className="mr-1"/> New Project
      </button>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={20} className="page-search-icon"/>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              type="text" placeholder="Search projects..."
              className="page-search-input"
            />
          </div>
          <button 
            onClick={() => setFilterBtn(!filterBtn)} 
            className={`page-mute-btn ${filterBtn ? "page-mute-btn-active" : ""}`}>
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
              <p className="p-2 page-sub-text">By Your Role:</p>
              <select 
                value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 page-select-bg">
                  <option value="">All Roles</option>
                  {RoleArr.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-full p-3 md:w-64">
              <p className="p-2 page-sub-text">By Due Date:</p>
              <select 
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 page-select-bg">
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
  );
}