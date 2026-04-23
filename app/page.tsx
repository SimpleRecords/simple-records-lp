import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Editorial } from "@/components/sections/editorial";
import { Flow } from "@/components/sections/flow";
import { Faq } from "@/components/sections/faq";
import { Apply } from "@/components/sections/apply";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Editorial />
        <Flow />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
