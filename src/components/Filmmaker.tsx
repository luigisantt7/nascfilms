import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { site } from "@/data/site";
import { content } from "@/data/content";

const PILLARS = [
  {
    n: "01",
    label: "Cinematografia",
    text: "Enquadramento, luz e movimento de câmera pensados cena a cena, não apenas apontados para o que acontece.",
  },
  {
    n: "02",
    label: "Narrativa",
    text: "Um começo, um meio e um fim — o dia é editado como uma história, com ritmo próprio do casal ou da família.",
  },
  {
    n: "03",
    label: "Emoção",
    text: "Som, trilha e cortes escolhidos para que o filme se sinta do jeito que o dia se sentiu.",
  },
];

/** Shortest signed distance from `i` to `active` on a circular track of length `len`. */
function circularOffset(i: number, active: number, len: number): number {
  let diff = i - active;
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  return diff;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function FilmCarousel({ films }: { films: string[] }) {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const peekOffset = isMobile ? 34 : 62;

  function go(delta: number) {
    setActive((i) => (i + delta + films.length) % films.length);
  }

  return (
    <div className="mb-16">
      <div className="relative flex h-[300px] items-center justify-center overflow-hidden sm:h-[460px] lg:h-[540px]">
        {films.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Filme anterior"
              onClick={() => go(-1)}
              className="absolute left-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:bg-black/60 sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Próximo filme"
              onClick={() => go(1)}
              className="absolute right-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:bg-black/60 sm:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="relative flex h-full w-full items-center justify-center">
          {films.map((src, i) => {
            const offset = circularOffset(i, active, films.length);
            if (Math.abs(offset) > 2) return null;
            const isActive = offset === 0;

            return (
              <video
                key={`${i}-${src}`}
                src={src}
                muted
                loop
                playsInline
                preload="metadata"
                controls={isActive}
                onClick={() => !isActive && setActive(i)}
                className={`absolute rounded-sm shadow-[0_30px_60px_rgba(0,0,0,.45)] transition-all duration-500 ease-out ${
                  isActive
                    ? "h-full w-auto opacity-100"
                    : "h-[72%] w-auto cursor-pointer opacity-35 hover:opacity-55"
                }`}
                style={{
                  transform: `translateX(${offset * peekOffset}%) scale(${isActive ? 1 : 0.92})`,
                  zIndex: 20 - Math.abs(offset),
                }}
              />
            );
          })}
        </div>
      </div>

      {films.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {films.map((src, i) => (
            <button
              key={`${i}-${src}`}
              type="button"
              aria-label={`Ver filme ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-6 bg-sand" : "w-1.5 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Filmmaker() {
  const films = content.featuredFilms ?? [];
  const hasFilms = films.length > 0;
  const hasExternalLink = Boolean(site.heroFilm);

  return (
    <section id="filmes" className="bg-umber-deep py-28 text-paper">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-14">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-10">
          <h2 className="max-w-[14ch] text-balance font-display text-[30px] font-medium leading-[1.08] sm:text-[38px] lg:text-[50px]">
            Filmes que fazem você voltar para o momento.
          </h2>
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-white/60">
            Do primeiro olhar à última dança, cada detalhe é pensado para criar um filme com
            ritmo, emoção e identidade própria.
          </p>
        </div>

        {hasFilms ? (
          <FilmCarousel films={films} />
        ) : (
          <div
            className="relative mb-16 flex aspect-video w-full items-center justify-center overflow-hidden rounded-sm border border-white/15"
            style={{
              background:
                "radial-gradient(circle at 70% 30%, rgba(216,208,199,.10), transparent 55%), linear-gradient(135deg,#3a2c22,#171310 70%)",
            }}
          >
            <span className="absolute left-[18px] top-[18px] text-[11px] uppercase tracking-[.12em] text-white/60">
              Filme em destaque{hasExternalLink ? "" : " — em breve"}
            </span>
            <a
              href={hasExternalLink ? site.heroFilm : undefined}
              target={hasExternalLink ? "_blank" : undefined}
              rel={hasExternalLink ? "noopener" : undefined}
              aria-disabled={!hasExternalLink}
              className={`flex flex-col items-center gap-3.5 ${hasExternalLink ? "" : "pointer-events-none opacity-70"}`}
            >
              <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/15 transition-transform hover:scale-105 hover:bg-white/10">
                <Play size={22} className="ml-1" fill="currentColor" />
              </span>
              <span className="text-xs uppercase tracking-[.14em] text-white/60">
                {hasExternalLink ? "Assistir filme" : "Filme em breve"}
              </span>
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.n}>
              <div className="mb-3.5 font-display text-[44px] italic leading-none text-umber-light">
                {p.n}
              </div>
              <div className="mb-2.5 text-[13px] font-semibold uppercase tracking-[.1em]">
                {p.label}
              </div>
              <p className="max-w-[30ch] text-sm leading-relaxed text-white/60">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
