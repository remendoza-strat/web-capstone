import { CheckCircle, Users, Zap } from "lucide-react"

export default function Hero(){
  return(
    <section className="flex items-center justify-center min-h-screen px-6 py-16 bg-white dark:bg-gray-900">
      <div className="w-full max-w-5xl text-center">
        <h1 className="m-5 text-4xl font-extrabold leading-tight text-gray-900 break-words dark:text-white sm:text-5xl lg:text-6xl">
          Streamline Your
          <span className="text-blue-600"> Project Management</span>
        </h1>
        <p className="m-5 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
          Organize tasks, collaborate with your team, and deliver projects on time with our intuitive kanban style project management platform.
        </p>
        <div className="flex flex-col items-center justify-center mt-8 space-y-4 md:flex-row md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <CheckCircle className="w-6 h-6 text-blue-600"/>
            <span>Free to Use</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Users className="w-6 h-6 text-blue-600"/>
            <span>Team Collaboration</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <Zap className="w-6 h-6 text-blue-600"/>
            <span>Real-time Updates</span>
          </div>
        </div>
      </div>
    </section>
  );
}