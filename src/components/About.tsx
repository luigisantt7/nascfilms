import { site } from "@/data/site";
import { content } from "@/data/content";

export function About() {
  const hasImage = Boolean(content.aboutImage);

  return (
    <section id="sobre" className="bg-umber-deep py-28 text-paper">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-9 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-[70px] lg:px-14">
        <div
          className="relative flex aspect-[4/5] items-end overflow-hidden rounded-sm border border-white/15 p-4.5 text-[11px] uppercase tracking-[.1em] text-white/60"
          style={hasImage ? undefined : { background: "linear-gradient(160deg,#4a382c,#1b1512)" }}
        >
          {hasImage ? (
            <img src={content.aboutImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            "Foto profissional a definir"
          )}
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.14em] text-sand">Sobre</p>
          <h2 className="mb-6 font-display text-[28px] font-medium sm:text-[36px] lg:text-[44px]">
            Por trás da câmera.
          </h2>
          <p className="mb-4 max-w-[56ch] text-[15.5px] leading-loose text-white/60">
            O trabalho do NASC Films nasceu da vontade de contar histórias através de imagens.
            Entre câmeras, lentes e edição, o audiovisual virou a forma de transformar momentos
            reais em experiências que podem ser revisitadas.
          </p>
          <p className="max-w-[56ch] text-[15.5px] leading-loose text-white/60">
            Hoje, fotografia e filmmaking são feitos para quem quer mais do que um simples
            registro — quer guardar a sensação daquele dia.
          </p>
          <div className="mt-8 flex flex-wrap gap-9">
            <div className="border-t border-white/15 pt-2.5 text-xs uppercase tracking-[.08em] text-white/60">
              {site.city}
            </div>
            <div className="border-t border-white/15 pt-2.5 text-xs uppercase tracking-[.08em] text-white/60">
              Casamentos · Eventos · Ensaios
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
