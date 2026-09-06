# NASC Films — site

Site de portfólio para fotógrafo/filmmaker, construído em **React + TypeScript +
Vite + Tailwind CSS + shadcn/ui**.

## Rodar localmente

Precisa de [Node.js](https://nodejs.org) 18 ou mais recente instalado.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Editar o conteúdo

Não precisa mexer nos componentes para as edições do dia a dia:

- **`src/data/site.ts`** — WhatsApp, Instagram, e-mail, cidade e o link do
  filme em destaque. Enquanto estiver vazio (`""`), o site mostra "em breve"
  no lugar do link.
- **`src/data/works.ts`** — os trabalhos do portfólio (título, tipo, ano,
  cidade, descrição, foto de capa, link do filme). Copie um item existente
  para adicionar um novo.

Para trocar a foto de capa de um trabalho, coloque o arquivo de imagem dentro
de `public/` (por exemplo `public/trabalhos/ana-gabriel.jpg`) e referencie
como `cover: "/trabalhos/ana-gabriel.jpg"` no `works.ts`.

Depois de editar, rode `npm run build` de novo antes de publicar.

### Tela de edição local (sem mexer em código)

Para editar o site sem tocar em código, com `npm run dev` rodando, abra:

```
http://localhost:5173/admin.html
```

Tem uma aba para cada parte editável do site:

- **Trabalhos** — adicionar, editar ou remover trabalhos do portfólio (título,
  tipo, ano, cidade, descrição, foto de capa e galeria de fotos do evento,
  link do filme).
- **Página inicial** — foto de fundo da abertura do site.
- **Filme em destaque** — upload do vídeo que toca direto na página "Filmes"
  (ou, alternativamente, um link do Vimeo/YouTube).
- **Sobre** — foto da seção "Por trás da câmera".
- **Contato** — nome da marca, tagline, cidade, WhatsApp, Instagram, e-mail.

A ferramenta grava tudo sozinha: textos em `src/data/*.json`, fotos em
`public/trabalhos/` e `public/site/`, vídeos em `public/videos/` — não
precisa editar arquivo nenhum na mão.

Essa tela só existe localmente, no seu computador, enquanto `npm run dev`
está rodando — ela não é publicada junto com o site. Depois de editar, rode
`npm run build` de novo e publique a pasta `dist` atualizada.

## Publicar o site (com domínio próprio)

Este projeto gera um site estático — pode ser hospedado em qualquer serviço.
O caminho mais simples é a [Vercel](https://vercel.com) ou a
[Netlify](https://netlify.com), ambas com plano gratuito:

1. Crie uma conta e escolha "importar projeto" / "novo site".
2. Suba esta pasta (ou conecte um repositório Git com este código).
3. Comando de build: `npm run build` — pasta de saída: `dist`.
4. Depois do primeiro deploy, vá em **Domains** e adicione seu domínio
   próprio, seguindo as instruções de DNS que a própria plataforma mostra.

A cada alteração no conteúdo (`site.ts` / `works.ts`) e novo deploy, o site
publicado é atualizado.

## Stack

- [Vite](https://vite.dev) — build e servidor de desenvolvimento
- [React 19](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) — estilos utilitários
- [shadcn/ui](https://ui.shadcn.com) — componentes (botão, diálogo/lightbox,
  menu lateral, formulário) sobre [Radix UI](https://www.radix-ui.com)
- [lucide-react](https://lucide.dev) — ícones

## Sobre o formulário de contato

O formulário de orçamento não tem back-end: ao enviar, ele abre o e-mail (ou
o WhatsApp) do visitante já com a mensagem preenchida — nada fica salvo em
nenhum banco de dados. Se no futuro você quiser receber os pedidos direto em
uma planilha, um banco de dados ou uma automação, isso pode ser adicionado
depois.
