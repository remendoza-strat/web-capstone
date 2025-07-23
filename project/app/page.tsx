import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Kanban } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-platinum-900 to-platinum-800 dark:from-outer_space-500 dark:to-payne's_gray-500">
        {/* Hero Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl text-outer_space-500 dark:text-platinum-500">
              Manage Projects with
              <span className="text-blue_munsell-500"> Kanban Boards</span>
            </h1>

            <p className="text-xl text-payne's_gray-500 dark:text-french_gray-500 mb-8 max-w-2xl mx-auto">
              Organize tasks, collaborate with teams, and track progress with our intuitive drag-and-drop project
              management platform.
            </p>

            <div className="flex flex-col justify-center gap-4 mb-12 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-lg bg-blue_munsell-500 hover:bg-blue_munsell-600"
              >
                Start Managing Projects
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 rounded-lg border-blue_munsell-500 text-blue_munsell-500 hover:bg-blue_munsell-50 dark:hover:bg-blue_munsell-900"
              >
                View Projects
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="grid max-w-3xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
              <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
                <Kanban className="text-blue_munsell-500" size={20} />
                <span>Drag & Drop Boards</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
                <Users className="text-blue_munsell-500" size={20} />
                <span>Team Collaboration</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
                <CheckCircle className="text-blue_munsell-500" size={20} />
                <span>Task Management</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Demo Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/50 dark:bg-outer_space-400/50">
          <div className="container mx-auto text-center">
            <h2 className="mb-8 text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
              🚀 Navigate the Mock Site
            </h2>
            <p className="text-lg text-payne's_gray-500 dark:text-french_gray-500 mb-8">
              All pages are accessible without authentication for development purposes
            </p>

            <div className="grid max-w-4xl grid-cols-1 gap-4 mx-auto md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/dashboard"
                className="p-4 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
              >
                <h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">Dashboard</h3>
                <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Main dashboard view</p>
              </Link>

              <Link
                href="/projects"
                className="p-4 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
              >
                <h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">Projects</h3>
                <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Projects listing page</p>
              </Link>

              <Link
                href="/projects/1"
                className="p-4 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
              >
                <h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">Kanban Board</h3>
                <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Project board view</p>
              </Link>

              <Link
                href="/sign-in"
                className="p-4 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
              >
                <h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">Auth Pages</h3>
                <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Sign in/up placeholders</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Task Implementation Status */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center text-outer_space-500 dark:text-platinum-500">
              Implementation Roadmap
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { phase: "1.0", title: "Project Setup", status: "pending", tasks: 6 },
                { phase: "2.0", title: "Authentication", status: "pending", tasks: 6 },
                { phase: "3.0", title: "Database Setup", status: "pending", tasks: 6 },
                { phase: "4.0", title: "Core Features", status: "pending", tasks: 6 },
                { phase: "5.0", title: "Kanban Board", status: "pending", tasks: 6 },
                { phase: "6.0", title: "Advanced Features", status: "pending", tasks: 6 },
                { phase: "7.0", title: "Testing", status: "pending", tasks: 6 },
                { phase: "8.0", title: "Deployment", status: "pending", tasks: 6 },
              ].map((item) => (
                <div
                  key={item.phase}
                  className="p-6 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-payne's_gray-400"
                >
                  <div className="mb-2 text-sm font-semibold text-blue_munsell-500">Phase {item.phase}</div>
                  <h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">{item.title}</h3>
                  <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-3">{item.tasks} tasks</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 mr-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-payne's_gray-500 dark:text-french_gray-400 capitalize">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  )
}
