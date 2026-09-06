// Trabalhos do portfólio.
// Não edite este arquivo à mão: rode `npm run dev` e abra http://localhost:5173/admin.html
// para adicionar, editar ou remover trabalhos — a ferramenta grava os dados em works.json
// e as fotos em public/trabalhos/ sozinha. Depois de editar, rode `npm run build` de novo.
import raw from "./works.json";

export type Work = {
  id: string;
  title: string;
  type: "Casamento" | "Aniversário" | "Batizado" | "Evento" | "Ensaio";
  year: string;
  city: string;
  desc: string;
  /** Caminho para a imagem em /public, ou "" para usar um bloco de cor. */
  cover: string;
  /** Fotos adicionais do evento, mostradas na galeria ao abrir o trabalho. */
  gallery?: string[];
  /** Link do filme no Vimeo/YouTube, opcional. */
  filmUrl: string;
  demo?: boolean;
};

export const works: Work[] = raw as Work[];
