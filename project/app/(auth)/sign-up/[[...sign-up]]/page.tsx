"use client"
import { useTheme } from "@/components/theme-provider"
import { SignUp } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignUpPage(){
  const { theme } = useTheme();
  const colorBackground = theme === "dark" ? "bg-black_shades-200" : "bg-platinum-100";

  return(
    <>
      <Header/>
      <div className="flex items-center justify-center min-h-screen p-8 bg-platinum-300 dark:bg-black_shades-100">
        <div className="flex justify-center w-full max-w-md mx-auto">
          <SignUp
            appearance={{
              variables: {
                colorPrimary: "#146a7f",
                colorBackground: "colorBackground"
              },
              elements: {
                dividerText: "text-gray-300",
                dividerLine: "bg-gray-300",
                card: "bg-platinum-100 dark:bg-black_shades-200",
                headerTitle: "font-bold text-3xl text-black_shades dark:text-french_gray-50",
                headerSubtitle: "text-base text-platinum-600",
                socialButtonsBlockButton: "bg-french_gray-50 text-black_shades hover:text-french_gray-50 hover:bg-blue_munsell-400",
                formFieldLabel: "text-base text-black_shades dark:text-french_gray-50",
                footerActionText: "text-sm text-platinum-600",
                footerActionLink: "text-sm text-blue_munsell-400 hover:underline"
              }
            }}
          />
        </div>
      </div>
      <Footer/>
    </>
  );
}