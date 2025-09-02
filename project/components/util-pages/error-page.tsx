import Link from "next/link"

export default function ErrorPage({ message }: { message: string }){
  return(
    <div className="flex items-center justify-center h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center p-8 text-center bg-white shadow-lg rounded-2xl dark:bg-gray-800">
        <h1 className="font-extrabold text-red-600 text-7xl dark:text-red-400 animate-pulse">
          Error Detected
        </h1>
        <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Something went wrong. Please try again or return to the homepage.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2 mt-6 text-sm font-medium text-white transition-colors bg-red-600 shadow rounded-xl hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}