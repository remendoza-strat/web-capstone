import Link from "next/link"

export function Footer(){
  return(
    <footer className="py-5 border-t border-gray-300 bg-black_shades-200 dark:bg-platinum-100">
      <div>
        <div className="flex flex-col p-3 lg:flex-row">
          <div className="flex-1 m-2 text-center">
            <h3 className="mb-4 text-2xl font-bold text-blue_munsell-400">
              ProjectFlow
            </h3>
            <p className="text-base font-normal text-platinum-300 dark:text-black_shades-100">
              The modern project management platform that helps teams collaborate and deliver results.
            </p>
          </div>
          <div className="flex flex-1 m-2 text-center">
            <div className="flex-1">
              <h4 className="mb-4 text-lg font-semibold text-blue_munsell-400">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="#features" 
                    className="text-sm font-normal text-platinum-300 dark:text-black_shades-100 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#pricing" 
                    className="text-sm font-normal text-platinum-300 dark:text-black_shades-100 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#about" 
                    className="text-sm font-normal text-platinum-300 dark:text-black_shades-100 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="mb-4 text-lg font-semibold text-blue_munsell-400">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="#helpcenter" 
                    className="text-sm font-normal text-platinum-300 dark:text-black_shades-100 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#contact" 
                    className="text-sm font-normal text-platinum-300 dark:text-black_shades-100 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#apidocs" 
                    className="text-sm font-normal text-platinum-300 dark:text-black_shades-100 hover:text-blue_munsell-400 dark:hover:text-blue_munsell-400"
                  >
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 text-center border-t border-gray-300">
          <p className="text-lg font-medium text-platinum-300 dark:text-black_shades-100">
            © 2025 ProjectFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}