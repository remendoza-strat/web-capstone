import Link from "next/link"

export function Footer(){
  return(
    <footer className="p-2 border-t page-card">
      <div className="flex">
          <div className="flex-1 m-2 text-center">
            <Link href="/" className="page-logo">
              ProjectFlow
            </Link>
            <p className="m-2 page-dark-light-text">
              The modern project management platform that helps teams collaborate and deliver results.
            </p>
            <p className="m-2 page-dark-light-text">
              © 2025 ProjectFlow. All rights reserved.
            </p>
          </div>
      </div>
    </footer>
  );
}