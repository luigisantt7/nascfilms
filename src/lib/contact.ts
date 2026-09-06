import { site } from "@/data/site";

export type ContactLink = { label: string; href: string | null };

export function waLink(text?: string): string | null {
  const digits = site.whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function contactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  const wa = waLink("Olá! Vim pelo site e quero um orçamento.");
  links.push({ label: wa ? "WhatsApp" : "WhatsApp em breve", href: wa });
  links.push({
    label: site.instagram ? "Instagram" : "Instagram em breve",
    href: site.instagram ? `https://instagram.com/${site.instagram.replace("@", "")}` : null,
  });
  links.push({
    label: site.email ? "E-mail" : "E-mail em breve",
    href: site.email ? `mailto:${site.email}` : null,
  });
  return links;
}
