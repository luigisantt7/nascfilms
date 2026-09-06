import { contactLinks } from "@/lib/contact";

export function FinalCta() {
  const links = contactLinks();

  return (
    <section className="bg-ink py-32 text-center text-paper">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-14">
        <h2 className="mx-auto mb-6 max-w-[16ch] text-balance font-display text-[36px] font-medium leading-[1.02] sm:text-[54px] lg:text-[74px]">
          Sua história merece um filme.
        </h2>
        <p className="mx-auto mb-11 max-w-[44ch] text-[17px] text-white/60">
          Vamos transformar o seu próximo momento em uma história para guardar.
        </p>
        <a
          href="#contato"
          className="inline-flex rounded-sm border border-white/20 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[.08em] hover:border-paper"
        >
          Entrar em contato
        </a>
        <div className="mt-11 flex flex-wrap justify-center gap-8">
          {links.map((l) =>
            l.href ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="border-b border-white/20 pb-1 text-[13px] font-semibold uppercase tracking-[.08em] hover:border-paper"
              >
                {l.label}
              </a>
            ) : (
              <span key={l.label} className="pb-1 text-[13px] font-semibold uppercase tracking-[.08em] text-white/40">
                {l.label}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
