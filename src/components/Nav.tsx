import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#trabalhos", label: "Trabalhos" },
  { href: "#filmes", label: "Filmes" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 py-[22px] text-paper transition-[background-color,padding,box-shadow] duration-300 sm:px-8 lg:px-14",
        solid && "bg-paper py-3.5 text-[#241A13] shadow-[0_1px_2px_rgba(20,14,9,.06)]",
      )}
    >
      <a href="#topo" className="font-display text-[19px] font-medium tracking-[.06em]">
        NASC FILMS
      </a>

      <ul className="hidden items-center gap-9 lg:flex">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="group relative py-1 text-[12.5px] font-semibold uppercase tracking-[.12em]"
            >
              {l.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <Button
          asChild
          className="hidden rounded-sm bg-ink px-7 py-5 text-[13px] font-semibold uppercase tracking-[.08em] text-paper hover:bg-umber lg:inline-flex"
        >
          <a href="#contato">Orçamento</a>
        </Button>
        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-1.5 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[110] flex w-[min(78vw,340px)] flex-col items-start justify-center gap-7 bg-ink px-10 text-paper transition-transform duration-400 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[15px] font-semibold uppercase tracking-[.1em]"
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
