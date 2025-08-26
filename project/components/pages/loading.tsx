import { Loader2 } from "lucide-react"

export default function LoadingPage(){
  return(
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl dark:bg-gray-800">
        <Loader2 className="text-blue-600 w-14 h-14 animate-spin dark:text-blue-400"/>
        <span className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Loading...
        </span>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please wait while we prepare things for you.
        </p>
      </div>
    </div>
  );
}