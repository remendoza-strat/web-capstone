import Link from "next/link"

export default function Footer(){
  return(
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-6 py-10">
        <div className="max-w-2xl mx-auto text-center">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            ProjectFlow
          </Link>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            The modern project management platform that help teams collaborate and deliver results.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            © 2025 ProjectFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}