import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SiteFields = {
  brandFull: string;
  tagline: string;
  city: string;
  whatsapp: string;
  instagram: string;
  email: string;
};

const EMPTY: SiteFields = {
  brandFull: "",
  tagline: "",
  city: "",
  whatsapp: "",
  instagram: "",
  email: "",
};

export function ContactTab() {
  const [form, setForm] = useState<SiteFields>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          brandFull: data.brandFull ?? "",
          tagline: data.tagline ?? "",
          city: data.city ?? "",
          whatsapp: data.whatsapp ?? "",
          instagram: data.instagram ?? "",
          email: data.email ?? "",
        });
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Falha ao salvar");
      setMessage("Dados de contato atualizados.");
    } catch (err) {
      setMessage(`Erro: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-[560px] space-y-4 border border-[#D8D0C7] p-6">
      <h2 className="text-base font-semibold">Marca e contato</h2>

      <div className="space-y-1.5">
        <Label>Nome da marca</Label>
        <Input value={form.brandFull} onChange={(e) => setForm({ ...form, brandFull: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Tagline (abaixo do nome)</Label>
        <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Cidade</Label>
        <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="São Paulo — SP" />
      </div>
      <div className="space-y-1.5">
        <Label>WhatsApp (com DDI e DDD, só números)</Label>
        <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="5511999999999" />
      </div>
      <div className="space-y-1.5">
        <Label>Instagram (sem @)</Label>
        <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="nascfilms" />
      </div>
      <div className="space-y-1.5">
        <Label>E-mail</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <Button type="button" onClick={handleSave} disabled={saving}>
        {saving ? "Salvando..." : "Salvar"}
      </Button>
      {message && <p className="text-[13px]">{message}</p>}
    </div>
  );
}
