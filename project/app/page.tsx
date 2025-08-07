import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Kanban } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"

export default function HomePage() {
  return (
    <>
      <Header/>
      <div className="bg-page_light dark:bg-page_dark">
        <Hero/>
      <Features/>
      </div>
      
      <Footer/>
    </>
  )
}
