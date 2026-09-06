import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { fileToDataUrl } from "./utils";

export function HeroTab() {
  const [heroImage, setHeroImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setHeroImage(data.heroImage ?? "");
        setLoading(false);
      });
  }, []);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(await fileToDataUrl(f));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      let path = heroImage;
      if (file) {
        const dataUrl = await fileToDataUrl(file);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, slug: "hero" }),
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error ?? "Falha ao enviar foto");
        path = data.path;
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImage: path }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Falha ao salvar");
      setHeroImage(path);
      setFile(null);
      setPreview("");
      setMessage("Foto de capa atualizada.");
    } catch (err) {
      setMessage(`Erro: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImage: "" }),
    });
    const data = await res.json();
    if (data.ok) {
      setHeroImage("");
      setFile(null);
      setPreview("");
      setMessage("Foto de capa removida.");
    }
    setSaving(false);
  }

  if (loading) return <p>Carregando...</p>;

  const shown = preview || heroImage;

  return (
    <div className="max-w-[560px] space-y-4 border border-[#D8D0C7] p-6">
      <h2 className="text-base font-semibold">Foto de capa (abertura do site)</h2>
      <p className="text-[13px] text-[#5A4030]">
        Essa foto aparece de fundo na primeira tela do site, atrás do título "Momentos que
        merecem virar filme."
      </p>

      {shown ? (
        <img src={shown} alt="" className="aspect-video w-full rounded-sm object-cover" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-[#2A211C] text-[13px] text-white/60">
          Nenhuma foto definida
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div className="flex gap-3">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar foto de capa"}
        </Button>
        {heroImage && (
          <Button type="button" variant="outline" onClick={handleRemove} disabled={saving}>
            Remover foto
          </Button>
        )}
      </div>
      {message && <p className="text-[13px]">{message}</p>}
    </div>
  );
}
