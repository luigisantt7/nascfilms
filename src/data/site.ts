// Dados gerais do site — marca, contato, cidade.
// Não edite este arquivo à mão: use http://localhost:5173/admin.html com `npm run dev` rodando
// (aba "Contato"). Deixe os campos de contato "" para o site mostrar "em breve" no lugar do link.
import raw from "./site.json";

type SiteConfig = {
  brandFull: string;
  tagline: string;
  city: string;
  whatsapp: string;
  instagram: string;
  email: string;
  /** Link do filme em destaque no Vimeo/YouTube (usado só se não houver vídeo enviado). */
  heroFilm: string;
};

export const site: SiteConfig = raw as SiteConfig;
