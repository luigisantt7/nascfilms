// Conteúdo visual do site (fotos e filme em destaque).
// Não edite este arquivo à mão: use http://localhost:5173/admin.html com `npm run dev` rodando.
import raw from "./content.json";

export type SiteContent = {
  /** Foto de fundo da abertura do site (Hero). Caminho em /public, ou "" para o fundo padrão. */
  heroImage: string;
  /** Foto usada na seção "Sobre" (Por trás da câmera). */
  aboutImage: string;
  /** Vídeos locais (mp4) do carrossel "Filme em destaque", tocados direto na página. */
  featuredFilms: string[];
};

export const content: SiteContent = raw as SiteContent;
