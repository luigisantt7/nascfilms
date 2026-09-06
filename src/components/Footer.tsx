import { site } from "@/data/site";
import { contactLinks } from "@/lib/contact";

export function Footer() {
  const links = contactLinks();

  return (
    <footer className="bg-umber-deep py-16 pb-9 text-white/60">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-14">
        <div className="mb-7 flex flex-wrap justify-between gap-8 border-b border-white/15 pb-10">
          <div>
            <div className="font-display text-[22px] tracking-[.04em] text-paper">
              {site.brandFull.toUpperCase()}
            </div>
            <small className="mt-2 block text-xs uppercase tracking-[.08em] text-white/60">
              {site.tagline}
            </small>
          </div>
          <ul className="flex flex-wrap gap-6">
            {links.map((l) => (
              <li key={l.label}>
                {l.href ? (
                  <a href={l.href} target="_blank" rel="noopener" className="text-sm hover:text-paper">
                    {l.label}
                  </a>
                ) : (
                  <span className="text-sm">{l.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap justify-between gap-3.5 text-xs">
          <span>© {new Date().getFullYear()} {site.brandFull}. Feito para contar histórias.</span>
          <span>{site.city}</span>
        </div>
      </div>
    </footer>
  );
}
