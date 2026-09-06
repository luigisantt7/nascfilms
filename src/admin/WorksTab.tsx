import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Work } from "@/data/works";
import { fileToDataUrl } from "./utils";

const EVENT_TYPES: Work["type"][] = ["Casamento", "Aniversário", "Batizado", "Evento", "Ensaio"];

type FormState = {
  id: string;
  title: string;
  type: Work["type"];
  year: string;
  city: string;
  desc: string;
  filmUrl: string;
  demo: boolean;
};

const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  type: "Casamento",
  year: "",
  city: "",
  desc: "",
  filmUrl: "",
  demo: false,
};

export function WorksTab() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/works");
    setWorks(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(work: Work) {
    setForm({
      id: work.id,
      title: work.title,
      type: work.type,
      year: work.year,
      city: work.city,
      desc: work.desc,
      filmUrl: work.filmUrl,
      demo: Boolean(work.demo),
    });
    setCoverFile(null);
    setCoverPreview(work.cover);
    setExistingGallery(work.gallery ?? []);
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNew() {
    setForm(EMPTY_FORM);
    setCoverFile(null);
    setCoverPreview("");
    setExistingGallery([]);
    setNewGalleryFiles([]);
    setNewGalleryPreviews([]);
  }

  async function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) setCoverPreview(await fileToDataUrl(file));
  }

  async function handleGalleryFilesChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews = await Promise.all(files.map(fileToDataUrl));
    setNewGalleryFiles((prev) => [...prev, ...files]);
    setNewGalleryPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  }

  function removeExistingGalleryPhoto(pathToRemove: string) {
    setExistingGallery((prev) => prev.filter((p) => p !== pathToRemove));
  }

  function removeNewGalleryFile(index: number) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload: Record<string, unknown> = { ...form };
      if (coverFile) payload.coverDataUrl = await fileToDataUrl(coverFile);
      payload.keepGallery = existingGallery;
      if (newGalleryFiles.length) {
        payload.galleryDataUrls = await Promise.all(newGalleryFiles.map(fileToDataUrl));
      }
      const res = await fetch("/api/admin/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Falha ao salvar");
      setWorks(data.works);
      setMessage(form.id ? "Trabalho atualizado." : "Trabalho adicionado.");
      startNew();
    } catch (err) {
      setMessage(`Erro: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este trabalho da galeria? A foto não é apagada do disco.")) return;
    const res = await fetch(`/api/admin/works?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      setWorks(data.works);
      if (form.id === id) startNew();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-10 grid gap-4 border border-[#D8D0C7] p-6">
        <h2 className="text-base font-semibold">
          {form.id ? `Editando: ${form.title}` : "Novo trabalho"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v as Work["type"] })}
            >
              <SelectTrigger>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Ano</Label>
            <Input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="2026"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Cidade</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="São Paulo"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Descrição</Label>
          <Textarea
            rows={3}
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Link do filme (Vimeo/YouTube, opcional)</Label>
          <Input
            value={form.filmUrl}
            onChange={(e) => setForm({ ...form, filmUrl: e.target.value })}
            placeholder="https://vimeo.com/..."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Foto de capa</Label>
          <p className="text-[12px] text-[#5A4030]">
            É a foto usada na miniatura do portfólio na página principal. Fica melhor com fotos
            na proporção retrato (3:4) — a imagem é cortada automaticamente para caber.
          </p>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
          {coverPreview && (
            <img
              src={coverPreview}
              alt=""
              className="mt-2 h-28 rounded-sm object-cover"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Fotos do evento (galeria)</Label>
          <p className="text-[12px] text-[#5A4030]">
            Fotos extras desse trabalho, mostradas quando alguém clica nele no portfólio.
            Pode selecionar várias de uma vez.
          </p>
          <input type="file" accept="image/*" multiple onChange={handleGalleryFilesChange} />
          {(existingGallery.length > 0 || newGalleryPreviews.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {existingGallery.map((p) => (
                <div key={p} className="relative">
                  <img src={p} alt="" className="h-20 w-20 rounded-sm object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingGalleryPhoto(p)}
                    aria-label="Remover foto"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newGalleryPreviews.map((src, i) => (
                <div key={src} className="relative">
                  <img src={src} alt="" className="h-20 w-20 rounded-sm object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewGalleryFile(i)}
                    aria-label="Remover foto"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-[13px]">
          <Checkbox
            checked={form.demo}
            onCheckedChange={(v) => setForm({ ...form, demo: Boolean(v) })}
          />
          Marcar como exemplo ilustrativo (demo)
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : form.id ? "Salvar alterações" : "Adicionar trabalho"}
          </Button>
          {form.id && (
            <Button type="button" variant="outline" onClick={startNew}>
              Cancelar edição
            </Button>
          )}
        </div>
        {message && <p className="text-[13px]">{message}</p>}
      </form>

      <h2 className="mb-4 text-base font-semibold">Trabalhos atuais ({works.length})</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-3">
          {works.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-4 border border-[#D8D0C7] p-3"
            >
              <div className="h-[60px] w-20 shrink-0 overflow-hidden rounded-sm bg-[#2A211C]">
                {w.cover && (
                  <img src={w.cover} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">
                  {w.title} {w.demo && <span className="font-normal text-[#5A4030]">(demo)</span>}
                </div>
                <div className="text-[13px] text-[#5A4030]">
                  {w.type} · {w.city} · {w.year}
                  {w.gallery?.length ? ` · ${w.gallery.length} foto(s) na galeria` : ""}
                </div>
              </div>
              <Button type="button" variant="outline" onClick={() => startEdit(w)}>
                Editar
              </Button>
              <Button type="button" variant="outline" onClick={() => handleDelete(w.id)}>
                Remover
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
