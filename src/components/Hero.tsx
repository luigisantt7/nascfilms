import { Grain } from "@/components/Grain";
import { Button } from "@/components/ui/button";
import { content } from "@/data/content";

export function Hero() {
  const hasImage = Boolean(content.heroImage);

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-paper"
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 30% 15%, rgba(90,64,48,.35), transparent 60%), linear-gradient(180deg, #16110d 0%, #0A0A0A 55%, #0A0A0A 100%)",
      }}
    >
      {hasImage && (
        <img
          src={content.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <Grain />
      {hasImage && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 22% 62%, rgba(0,0,0,.8), transparent 70%)",
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, rgba(0,0,0,.55) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A] from-0% via-[#0A0A0A]/80 via-45% to-transparent to-95%" />

      {!hasImage && (
        <span className="absolute right-5 top-[100px] rounded-sm border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[.12em] text-sand/80 sm:right-8 lg:right-14">
          Foto de capa a definir
        </span>
      )}

      <div className="relative z-[2] mx-auto w-full max-w-[1240px] px-5 pb-16 pt-40 sm:px-8 lg:px-14">
        <p className="mb-5 text-[13px] font-semibold uppercase tracking-[.18em] text-sand">
          Fotógrafo &amp; Filmmaker
        </p>
        <h1 className="mb-6 max-w-[15ch] text-balance font-display text-[42px] font-medium leading-[.98] tracking-[-.015em] sm:text-[64px] lg:text-[104px]">
          Momentos que merecem virar filme.
        </h1>
        <p className="mb-10 max-w-[46ch] text-[16px] leading-relaxed text-white/70 lg:text-[19px]">
          Fotografia e filmes cinematográficos para casamentos, aniversários, batizados e eventos.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Button asChild className="rounded-sm bg-ink px-7 py-5 text-[13px] font-semibold uppercase tracking-[.08em] text-paper hover:bg-umber">
            <a href="#contato">Solicitar orçamento</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-sm border-white/20 bg-transparent px-7 py-5 text-[13px] font-semibold uppercase tracking-[.08em] text-paper hover:border-paper hover:bg-transparent hover:text-paper"
          >
            <a href="#trabalhos">Ver meus trabalhos</a>
          </Button>
        </div>
      </div>

      <div className="relative z-[2] flex items-center gap-3 px-5 pb-9 text-[11px] uppercase tracking-[.14em] text-white/60 sm:px-8 lg:px-14">
        <span className="relative h-[34px] w-px overflow-hidden bg-white/15">
          <span className="absolute left-0 top-[-100%] h-full w-full animate-scrollmove bg-sand motion-reduce:animate-none motion-reduce:top-0" />
        </span>
        Role para explorar
      </div>
    </section>
  );
}
