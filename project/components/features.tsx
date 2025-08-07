import { Kanban, Users, Calendar, BarChart3, Shield, Zap } from "lucide-react"

// Storage of values to display
const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    description: "Visualize your workflow with intuitive drag-and-drop Kanban boards that keep your team organized."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates, comments, and task assignments."
  },
  {
    icon: Calendar,
    title: "Timeline Management",
    description: "Track deadlines and milestones with integrated calendar views and due date reminders."
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Monitor project progress with detailed analytics and performance insights."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security ensures your project data stays safe and confidential."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance delivers instant updates and smooth user experience."
  }
]

export function Features(){
  return(
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <div className="mb-10 text-center">
        <h2 className="mb-5 page-4-bd-text page-dark-light-text">
          Everything You Need to Succeed
        </h2>
        <p className="page-features-sub">
          Powerful features designed to help teams collaborate effectively and deliver projects on time.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="p-5 border page-card">
            <div className="flex items-center justify-center w-12 h-12 mb-5 page-light-blue-bg">
              <feature.icon className="page-dark-blue-text" size={24}/>
            </div>
            <h3 className="page-main-title page-dark-light-1-text">
              {feature.title}
            </h3>
            <p className="page-dark-light-text">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}