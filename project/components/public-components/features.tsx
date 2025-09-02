import { Kanban, Users, Calendar, BarChart3, Shield, Zap } from "lucide-react"

// Storage of values to display
const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    description: "Visualize your workflow with intuitive drag-and-drop kanban boards that keep your team organized."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates."
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
];

export default function Features(){
  return(
    <section className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mb-12 text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Everything You Need to Succeed
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
          Powerful features designed to help teams collaborate effectively and deliver projects on time.
        </p>
      </div>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 transition-colors bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-5 bg-blue-100 rounded-xl dark:bg-blue-900/30">
              <feature.icon className="w-6 h-6 text-blue-600"/>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}