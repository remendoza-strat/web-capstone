import { CheckCircle, Users, Zap } from "lucide-react"

export function Hero(){
  return(
    <section className="flex items-center justify-center min-h-screen px-8 py-16 text-center">
      <div className="w-full">
        <div className="flex-1">
          <h1 className="m-5 page-hero-title">
            Streamline Your
            <span className="page-dark-blue-text"> Project Management</span>
          </h1>
          <p className="m-5 page-light-dark-text">
            Organize tasks, collaborate with your team, and deliver projects on time with our intuitive Kanban-style
            project management platform.
          </p>
          <div className="flex flex-col items-center justify-center md:flex-row">
            <div className="flex items-center justify-center m-3 space-x-2">
              <CheckCircle className="page-dark-blue-text" size={20}/>
              <span className="page-gray-text">Free to Use</span>
            </div>
            <div className="flex items-center justify-center m-3 space-x-2">
              <Users className="page-dark-blue-text" size={20}/>
              <span className="page-gray-text">Team Collaboration</span>
            </div>
            <div className="flex items-center justify-center m-3 space-x-2">
              <Zap className="page-dark-blue-text" size={20}/>
              <span className="page-gray-text">Real-time Updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}