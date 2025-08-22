import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function HomePage(){
  return(
    <>
      <Header/>
        <div>
          <Hero/>
          <Features/>
        </div>
      <Footer/>
    </>
  );
}