"use client"
import { useTheme } from "@/components/theme-provider"
import { SignUp } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignUpPage(){
  const { theme } = useTheme();
  const colorBackground = theme === "dark" ? "bg-page_light-100" : "bg-page_dark-100";

  return(
    <>
      <Header/>
      <div className="flex items-center justify-center min-h-screen p-8 bg-page_light dark:bg-page_dark">
        <div className="flex justify-center w-full max-w-md mx-auto">
          <SignUp
            appearance = {{
              variables: {
                colorPrimary: "#1985a1",
                borderRadius: "0",
                colorBackground: "colorBackground"
              },
              elements: {
                card: "bg-page_light-100 dark:bg-page_dark-100",
                headerTitle: "text-3xl font-bold text-page_dark dark:text-page_light",
                headerSubtitle: "text-base font-light text-page_gray-200 dark:text-page_gray-100",
                socialButtonsBlockButton: "bg-page_light-100 hover:text-page_light-100 hover:bg-page_blue-100",
                dividerText: "text-page_gray dark:text-page_gray-100",
                dividerLine: "bg-page_gray bg:text-page_gray-100",
                formFieldLabel: "text-base font-normal text-page_dark dark:text-page_light",
                footerActionText: "text-page_gray dark:text-page_gray-100",
                footerActionLink: "text-page_blue-100",
                identityPreviewText: "text-page_dark dark:text-page_light",
                otpCodeFieldInput: "text-page_dark dark:text-page_light"
              }
            }}
          />
        </div>
      </div>
      <Footer/>
    </>
  );
}