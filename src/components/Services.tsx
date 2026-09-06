import { cn } from "@/lib/utils";

const SERVICES = [
  {
    n: "01",
    title: "Filmes cinematográficos",
    text: "Produção audiovisual com linguagem de cinema — direção visual, narrativa e edição autoral pensadas para transformar o evento em uma história.",
    feature: true,
  },
  {
    n: "02",
    title: "Fotografia",
    text: "Registros espontâneos, emocionais e cuidadosamente compostos, do preparativo ao último abraço.",
  },
  {
    n: "03",
    title: "Casamentos",
    text: "Fotografia e filme acompanhando todos os momentos, do making of à pista de dança.",
  },
  {
    n: "04",
    title: "Eventos",
    text: "Aniversários, batizados, formaturas, eventos corporativos e outras ocasiões que merecem ser bem contadas.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="bg-paper-dim py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-14">
        <h2 className="mb-14 font-display text-[30px] font-medium tracking-[-.01em] sm:text-[38px] lg:text-[50px]">
          O que eu faço
        </h2>
        <div className="grid grid-cols-1 gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {SERVICES.map((s) => (
            <div
              key={s.n}
              className={cn(
                "flex min-h-[260px] flex-col bg-paper-dim p-8",
                s.feature && "bg-ink text-paper",
              )}
            >
              <span className={cn("mb-auto font-display text-3xl italic text-umber", s.feature && "text-umber-light")}>
                {s.n}
              </span>
              <h3 className="mb-3 mt-6 font-display text-[22px] font-medium">{s.title}</h3>
              <p className={cn("text-sm leading-relaxed text-[#5B4C40]", s.feature && "text-white/60")}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
