import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactLinks, waLink } from "@/lib/contact";

const EVENT_TYPES = ["Casamento", "Aniversário", "Batizado", "Evento", "Ensaio", "Outro"];

export function Contact() {
  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    tipo: "Casamento",
    data: "",
    cidade: "",
    mensagem: "",
  });
  const links = contactLinks();

  function payload() {
    return [
      `Nome: ${form.nome}`,
      `WhatsApp: ${form.whatsapp}`,
      `E-mail: ${form.email}`,
      `Tipo de evento: ${form.tipo}`,
      `Data: ${form.data || "a combinar"}`,
      `Cidade: ${form.cidade}`,
      "",
      form.mensagem,
    ].join("\n");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const link = waLink(payload());
    if (link) window.open(link, "_blank");
    else alert("O número de WhatsApp ainda não foi configurado (src/data/site.ts).");
  }

  function handleWhatsapp() {
    const link = waLink("Olá! Vim pelo site e quero um orçamento.");
    if (link) window.open(link, "_blank");
    else alert("O número de WhatsApp ainda não foi configurado (src/data/site.ts).");
  }

  return (
    <section id="contato" className="py-28">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-[70px] lg:px-14">
        <div>
          <span className="mb-8 inline-block rounded-sm border border-umber px-3.5 py-2 text-[11px] uppercase tracking-[.1em] text-umber">
            Agenda aberta para 2027
          </span>
          <h3 className="mb-5 font-display text-[26px] font-medium leading-tight sm:text-[36px]">
            Vamos conversar sobre o seu evento.
          </h3>
          <p className="mb-7 text-[14.5px] leading-relaxed text-[#5B4C40]">
            Preencha o formulário com o que você já sabe sobre a data — o resto a gente ajusta na
            conversa. Resposta em até 48h.
          </p>
          <p className="text-[14.5px] leading-relaxed text-[#5B4C40]">
            Prefere falar direto?{" "}
            {links.map((l, i) => (
              <span key={l.label}>
                {l.href ? (
                  <a href={l.href} target="_blank" rel="noopener" className="border-b border-current">
                    {l.label}
                  </a>
                ) : (
                  <span className="opacity-60">{l.label}</span>
                )}
                {i < links.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="f-name" className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">
                Nome
              </Label>
              <Input
                id="f-name"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus-visible:border-umber focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-whats" className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">
                WhatsApp
              </Label>
              <Input
                id="f-whats"
                required
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus-visible:border-umber focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="f-email" className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">
                E-mail
              </Label>
              <Input
                id="f-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus-visible:border-umber focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">Tipo de evento</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger className="rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="f-date" className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">
                Data do evento
              </Label>
              <Input
                id="f-date"
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
                className="rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus-visible:border-umber focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-city" className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">
                Cidade
              </Label>
              <Input
                id="f-city"
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                className="rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus-visible:border-umber focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="f-msg" className="text-xs uppercase tracking-[.08em] text-[#5B4C40]">
              Conte um pouco sobre o que você está planejando
            </Label>
            <Textarea
              id="f-msg"
              rows={4}
              value={form.mensagem}
              onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
              className="resize-y rounded-none border-x-0 border-b border-t-0 border-black/15 bg-transparent px-0.5 focus-visible:border-umber focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button type="submit" className="rounded-sm bg-ink px-7 py-5 text-[13px] font-semibold uppercase tracking-[.08em] text-paper hover:bg-umber">
              Solicitar orçamento
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsapp}
              className="rounded-sm border-black/15 px-7 py-5 text-[13px] font-semibold uppercase tracking-[.08em] hover:border-umber hover:text-umber"
            >
              Falar pelo WhatsApp
            </Button>
          </div>
          <p className="text-[12.5px] text-[#5B4C40]">
            Ao clicar, seu WhatsApp abre com a mensagem pronta — nada é enviado
            automaticamente por este site.
          </p>
        </form>
      </div>
    </section>
  );
}
