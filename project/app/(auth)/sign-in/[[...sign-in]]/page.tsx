"use client"
import { useTheme } from "@/components/theme-provider"
import { SignIn } from "@clerk/nextjs"
import Header from "@/components/public-components/header"
import Footer from "@/components/public-components/footer"

export default function SignInPage(){
  const { theme } = useTheme();
  const colorBackground = theme === "dark" ? "bg-white" : "bg-gray-800";

  return(
    <>
      <Header/>
      <div className="flex items-center justify-center min-h-screen p-8 bg-white dark:bg-gray-900">
        <div className="flex justify-center w-full max-w-md mx-auto">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#2563eb",
                borderRadius: "0.75rem",
                colorBackground: "colorBackground"
              },
              elements: {
                card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl",
                headerTitle: "text-3xl font-extrabold text-gray-900 dark:text-white",
                headerSubtitle: "text-base text-gray-600 dark:text-gray-300",
                socialButtonsBlockButton: "bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors",
                dividerText: "text-gray-500 dark:text-gray-400",
                dividerLine: "bg-gray-200 dark:bg-gray-700",
                formFieldLabel: "text-sm font-medium text-gray-700 dark:text-gray-300",
                footerActionText: "text-gray-600 dark:text-gray-400",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                identityPreviewText: "text-gray-900 dark:text-white",
                otpCodeFieldInput: "text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-600"
              }
            }}
          />
        </div>
      </div>
      <Footer/>
    </>
  );
}