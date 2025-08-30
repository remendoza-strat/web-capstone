import Header from "@/components/public-components/header"
import Hero from "@/components/public-components/hero"
import Features from "@/components/public-components/features"
import Footer from "@/components/public-components/footer"

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