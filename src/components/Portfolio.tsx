import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { works, type Work } from "@/data/works";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function workPhotos(work: Work): string[] {
  return Array.from(new Set([work.cover, ...(work.gallery ?? [])].filter(Boolean)));
}

const COVER_PALETTE = [
  "linear-gradient(150deg,#5A4030,#2A211C)",
  "linear-gradient(150deg,#8A6A52,#2A211C)",
  "linear-gradient(150deg,#2A211C,#0A0A0A)",
];

export function Portfolio() {
  const [active, setActive] = useState<Work | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = active ? workPhotos(active) : [];

  useEffect(() => {
    setPhotoIndex(0);
  }, [active]);

  return (
    <section id="trabalhos" className="py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display text-[30px] font-medium tracking-[-.01em] sm:text-[38px] lg:text-[50px]">
            Trabalhos selecionados
          </h2>
          <p className="max-w-[34ch] text-[13px] text-[#5B4C40]">
            Casamentos, batizados, aniversários e ensaios — fotografia e filme lado a lado.
          </p>
        </div>

        {works.some((w) => w.demo) && (
          <p className="mb-11 max-w-[64ch] rounded-sm border border-dashed border-black/15 px-4 py-3 text-[13px] text-[#5B4C40]">
            Os trabalhos abaixo são exemplos ilustrativos, usados apenas para mostrar como o
            portfólio funciona — serão substituídos pelas fotos e filmes reais do NASC Films.
          </p>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((item, i) => (
            <button key={item.id} onClick={() => setActive(item)} className="block text-left">
              <span
                className="relative mb-4 flex aspect-[3/4] w-full items-end overflow-hidden rounded-sm transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] hover:scale-[1.008]"
                style={{
                  background: item.cover
                    ? undefined
                    : COVER_PALETTE[i % COVER_PALETTE.length],
                }}
              >
                {item.cover ? (
                  <img src={item.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="relative z-[1] p-4 font-display text-sm italic text-white/55">
                    {item.demo ? "Exemplo ilustrativo" : "Foto a definir"}
                  </span>
                )}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
              </span>
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-umber">
                {item.type}
              </span>
              <span className="mb-1 block font-display text-xl font-medium leading-tight">
                {item.title}
              </span>
              <span className="block text-[12.5px] text-[#5B4C40]">
                {item.city}
                {item.city ? " — " : ""}
                {item.year}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="grid max-h-[92vh] w-[95vw] max-w-[1160px] grid-rows-[45vh_1fr] gap-0 overflow-hidden border-none bg-umber-deep p-0 text-paper sm:h-[85vh] sm:grid-rows-1 sm:grid-cols-[1.3fr_1fr]">
          {active && (
            <>
              <div className="flex h-full min-h-0 min-w-0 flex-col bg-black/25">
                <div
                  className="relative min-h-0 flex-1"
                  style={{
                    background: photos.length ? undefined : "linear-gradient(150deg,#5A4030,#171310)",
                  }}
                >
                  {photos.length > 0 && (
                    <img
                      src={photos[photoIndex]}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Foto anterior"
                        onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Próxima foto"
                        onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <span className="absolute bottom-3 right-3 rounded-sm bg-black/40 px-2 py-1 text-[11px] text-white">
                        {photoIndex + 1} / {photos.length}
                      </span>
                    </>
                  )}
                </div>
                {photos.length > 1 && (
                  <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 bg-black/20 px-4 py-3">
                    {photos.map((p, i) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Ver foto ${i + 1}`}
                        className={`h-14 w-20 shrink-0 overflow-hidden rounded-sm border transition-opacity ${
                          i === photoIndex ? "border-sand opacity-100" : "border-white/15 opacity-60 hover:opacity-90"
                        }`}
                      >
                        <img src={p} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="min-h-0 min-w-0 overflow-y-auto px-6 py-8 sm:px-9 sm:py-10">
                <DialogTitle asChild>
                  <p className="mb-2 font-display text-2xl sm:text-[32px]">{active.title}</p>
                </DialogTitle>
                <p className="mb-2.5 text-[11px] uppercase tracking-[.12em] text-umber-light">
                  {active.type}
                  {active.demo ? " · exemplo ilustrativo" : ""}
                </p>
                <p className="mb-5 text-[13px] text-white/60">
                  {active.city}
                  {active.city ? " — " : ""}
                  {active.year}
                </p>
                <p className="max-w-[48ch] text-[15px] leading-relaxed text-white/70">
                  {active.desc}
                </p>
                {active.filmUrl && (
                  <Button asChild variant="outline" className="mt-6 rounded-sm border-white/20 bg-transparent text-paper hover:bg-white/10 hover:text-paper">
                    <a href={active.filmUrl} target="_blank" rel="noopener">
                      Assistir filme
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
