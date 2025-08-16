interface ErrorPageProps {
  code: number;
  message: string;
}

export default function ErrorPage({ code, message }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center bg-gray-50 dark:bg-gray-900">
      <h1 className="font-extrabold text-red-600 text-7xl dark:text-red-400">
        {code}
      </h1>
      <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
}
