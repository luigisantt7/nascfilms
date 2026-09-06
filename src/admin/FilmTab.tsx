import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function uploadVideo(f: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/admin/upload-video?filename=${encodeURIComponent(f.name)}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.ok) resolve(data.path);
        else reject(new Error(data.error ?? `Falha ao enviar vídeo (HTTP ${xhr.status})`));
      } catch {
        reject(
          new Error(
            `Resposta inválida do servidor (HTTP ${xhr.status} ${xhr.statusText}): ${xhr.responseText.slice(0, 200)}`
          )
        );
      }
    };
    xhr.onerror = () => reject(new Error(`Falha de rede ao enviar vídeo (HTTP ${xhr.status})`));
    xhr.ontimeout = () => reject(new Error("Tempo esgotado ao enviar o vídeo."));
    xhr.send(f);
  });
}

export function FilmTab() {
  const [films, setFilms] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [savingUrl, setSavingUrl] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/content").then((r) => r.json()),
      fetch("/api/admin/site").then((r) => r.json()),
    ]).then(([contentData, siteData]) => {
      setFilms(Array.isArray(contentData.featuredFilms) ? contentData.featuredFilms : []);
      setExternalUrl(siteData.heroFilm ?? "");
      setLoading(false);
    });
  }, []);

  async function saveFilms(next: string[]) {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featuredFilms: next }),
    });
    const data = await res.json();
    if (data.ok) setFilms(next);
    else setMessage(`Erro: ${data.error ?? "falha ao salvar"}`);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadPct(0);
    setMessage("");
    try {
      const path = await uploadVideo(file, setUploadPct);
      await saveFilms([...films, path]);
      setMessage("Vídeo adicionado ao carrossel.");
    } catch (err) {
      setMessage(`Erro: ${(err as Error).message}`);
    } finally {
      setUploading(false);
      setUploadPct(null);
    }
  }

  function handleRemove(index: number) {
    if (!confirm("Remover este vídeo do carrossel? O arquivo não é apagado do disco.")) return;
    saveFilms(films.filter((_, i) => i !== index));
  }

  function handleMove(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= films.length) return;
    const next = [...films];
    [next[index], next[target]] = [next[target], next[index]];
    saveFilms(next);
  }

  async function handleSaveExternalUrl() {
    setSavingUrl(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroFilm: externalUrl }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Falha ao salvar");
      setMessage("Link externo salvo.");
    } catch (err) {
      setMessage(`Erro: ${(err as Error).message}`);
    } finally {
      setSavingUrl(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-[640px] space-y-6 border border-[#D8D0C7] p-6">
      <div className="space-y-3">
        <h2 className="text-base font-semibold">Filmes em destaque (carrossel)</h2>
        <p className="text-[13px] text-[#5A4030]">
          Envie um ou mais vídeos (mp4) — horizontais ou verticais, pode misturar. Eles aparecem
          num carrossel na página, tocando direto ali, sem precisar do YouTube ou Vimeo. Arquivos
          grandes podem demorar para enviar.
        </p>

        {films.length > 0 && (
          <div className="space-y-2">
            {films.map((f, i) => (
              <div key={`${i}-${f}`} className="flex items-center gap-3 border border-[#D8D0C7] p-2">
                <video src={f} muted className="h-16 w-auto rounded-sm bg-black" />
                <span className="flex-1 truncate text-[12px] text-[#5A4030]">{f}</span>
                <Button type="button" variant="outline" onClick={() => handleMove(i, -1)} disabled={i === 0}>
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleMove(i, 1)}
                  disabled={i === films.length - 1}
                >
                  ↓
                </Button>
                <Button type="button" variant="outline" onClick={() => handleRemove(i)}>
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}

        <input type="file" accept="video/*" onChange={handleFileChange} disabled={uploading} />
        {uploadPct !== null && (
          <p className="text-[13px] text-[#5A4030]">Enviando... {uploadPct}%</p>
        )}
      </div>

      <div className="space-y-2 border-t border-[#D8D0C7] pt-5">
        <Label>Ou link externo (Vimeo/YouTube)</Label>
        <p className="text-[13px] text-[#5A4030]">
          Usado só como alternativa, caso nenhum vídeo tenha sido enviado acima — nesse caso o
          botão abre o link em outra aba, em vez de tocar na página.
        </p>
        <Input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://vimeo.com/..."
        />
        <Button type="button" onClick={handleSaveExternalUrl} disabled={savingUrl}>
          {savingUrl ? "Salvando..." : "Salvar link"}
        </Button>
      </div>

      {message && <p className="text-[13px]">{message}</p>}
    </div>
  );
}
