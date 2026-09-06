import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorksTab } from "./WorksTab";
import { HeroTab } from "./HeroTab";
import { FilmTab } from "./FilmTab";
import { AboutTab } from "./AboutTab";
import { ContactTab } from "./ContactTab";

export function AdminApp() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-10 font-sans text-[#2A211C]">
      <h1 className="mb-1 text-2xl font-bold">NASC Films — Admin local</h1>
      <p className="mb-8 max-w-[70ch] text-sm text-[#5A4030]">
        Ferramenta local para editar o site. Só funciona com <code>npm run dev</code> rodando
        neste computador — não fica disponível no site publicado. Depois de editar, rode{" "}
        <code>npm run build</code> e publique de novo.
      </p>

      <Tabs defaultValue="trabalhos">
        <TabsList className="mb-8 h-auto flex-wrap justify-start gap-1 bg-[#EAE3D9] p-1">
          <TabsTrigger value="trabalhos">Trabalhos</TabsTrigger>
          <TabsTrigger value="hero">Página inicial</TabsTrigger>
          <TabsTrigger value="filme">Filme em destaque</TabsTrigger>
          <TabsTrigger value="sobre">Sobre</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
        </TabsList>

        <TabsContent value="trabalhos">
          <WorksTab />
        </TabsContent>
        <TabsContent value="hero">
          <HeroTab />
        </TabsContent>
        <TabsContent value="filme">
          <FilmTab />
        </TabsContent>
        <TabsContent value="sobre">
          <AboutTab />
        </TabsContent>
        <TabsContent value="contato">
          <ContactTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
