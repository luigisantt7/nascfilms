import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Filmmaker } from "@/components/Filmmaker";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Marquee } from "@/components/Marquee";
import { FinalCta } from "@/components/FinalCta";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-paper focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Filmmaker />
        <Portfolio />
        <Services />
        <About />
        <Marquee />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
