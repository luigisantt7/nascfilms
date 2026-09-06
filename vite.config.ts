import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const dataDir = path.resolve(import.meta.dirname, "src/data");
const worksJsonPath = path.join(dataDir, "works.json");
const siteJsonPath = path.join(dataDir, "site.json");
const contentJsonPath = path.join(dataDir, "content.json");
const trabalhosDir = path.resolve(import.meta.dirname, "public/trabalhos");
const siteMediaDir = path.resolve(import.meta.dirname, "public/site");
const videosDir = path.resolve(import.meta.dirname, "public/videos");

type WorkRecord = {
  id: string;
  title: string;
  type: string;
  year: string;
  city: string;
  desc: string;
  cover: string;
  gallery?: string[];
  filmUrl: string;
  demo?: boolean;
};

function readWorks(): WorkRecord[] {
  return JSON.parse(fs.readFileSync(worksJsonPath, "utf-8"));
}

function writeWorks(works: WorkRecord[]) {
  fs.writeFileSync(worksJsonPath, JSON.stringify(works, null, 2) + "\n", "utf-8");
}

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath: string, data: Record<string, unknown>) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "arquivo"
  );
}

let saveCounter = 0;

/** Decodes a `data:image/...;base64,...` URL and saves it under the given public/ dir. */
function saveImage(dataUrl: string, titleForSlug: string, dir: string, publicPrefix: string): string | null {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const ext = match[1].split("/")[1].replace("jpeg", "jpg");
  const buffer = Buffer.from(match[2], "base64");
  fs.mkdirSync(dir, { recursive: true });
  saveCounter += 1;
  const filename = `${slugify(titleForSlug)}-${Date.now()}-${saveCounter}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `${publicPrefix}/${filename}`;
}

function readRequestBody(req: import("node:http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: import("node:http").ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

/**
 * Only active during `vite dev` (never bundled into the production build).
 * Backs the local-only admin UI at /admin.html so the site owner can manage
 * src/data/*.json and public/ media without touching code.
 */
function adminApiPlugin(): Plugin {
  return {
    name: "nascfilms-admin-api",
    apply: "serve",
    configureServer(server) {
      // Large video uploads can take a while on slower disks; remove Node's
      // default request timeouts so they aren't cut off mid-upload.
      server.httpServer?.once("listening", () => {
        const httpServer = server.httpServer as import("node:http").Server | undefined;
        if (httpServer && "requestTimeout" in httpServer) {
          httpServer.requestTimeout = 0;
          httpServer.headersTimeout = 0;
        }
      });

      server.middlewares.use("/api/admin/works", (req, res, next) => {
        if (req.method === "GET") {
          sendJson(res, 200, readWorks());
          return;
        }

        if (req.method === "POST") {
          readRequestBody(req).then((body) => {
            try {
              const data = JSON.parse(body);
              const works = readWorks();
              const id: string = data.id || `w-${Date.now()}`;
              const existing = works.find((w) => w.id === id);
              const titleForSlug = data.title || id;

              let cover: string = existing?.cover ?? "";
              if (typeof data.coverDataUrl === "string" && data.coverDataUrl) {
                cover = saveImage(data.coverDataUrl, titleForSlug, trabalhosDir, "/trabalhos") ?? cover;
              } else if (data.coverDataUrl === "") {
                cover = "";
              }

              // keepGallery: existing gallery paths the admin UI kept (others were dropped).
              // galleryDataUrls: newly uploaded photos for this work, saved and appended.
              const keepGallery: string[] = Array.isArray(data.keepGallery) ? data.keepGallery : (existing?.gallery ?? []);
              const newGalleryPaths = (Array.isArray(data.galleryDataUrls) ? data.galleryDataUrls : [])
                .map((dataUrl: string) => saveImage(dataUrl, titleForSlug, trabalhosDir, "/trabalhos"))
                .filter((p: string | null): p is string => Boolean(p));
              const gallery = [...keepGallery, ...newGalleryPaths];

              const entry: WorkRecord = {
                id,
                title: data.title ?? "",
                type: data.type ?? "Casamento",
                year: data.year ?? "",
                city: data.city ?? "",
                desc: data.desc ?? "",
                cover,
                gallery,
                filmUrl: data.filmUrl ?? "",
                demo: Boolean(data.demo),
              };

              const idx = works.findIndex((w) => w.id === id);
              if (idx >= 0) works[idx] = entry;
              else works.push(entry);

              writeWorks(works);
              sendJson(res, 200, { ok: true, works });
            } catch (err) {
              sendJson(res, 400, { ok: false, error: String(err) });
            }
          });
          return;
        }

        if (req.method === "DELETE") {
          const id = new URL(req.url ?? "", "http://localhost").searchParams.get("id");
          const works = readWorks().filter((w) => w.id !== id);
          writeWorks(works);
          sendJson(res, 200, { ok: true, works });
          return;
        }

        next();
      });

      // Generic read/write for the small site-wide JSON config files
      // (src/data/site.json — brand & contact; src/data/content.json — hero/about/film).
      for (const [route, filePath] of [
        ["/api/admin/site", siteJsonPath],
        ["/api/admin/content", contentJsonPath],
      ] as const) {
        server.middlewares.use(route, (req, res, next) => {
          if (req.method === "GET") {
            sendJson(res, 200, readJson(filePath));
            return;
          }
          if (req.method === "POST") {
            readRequestBody(req).then((body) => {
              try {
                const current = readJson(filePath);
                const updates = JSON.parse(body);
                const merged = { ...current, ...updates };
                writeJson(filePath, merged);
                sendJson(res, 200, { ok: true, data: merged });
              } catch (err) {
                sendJson(res, 400, { ok: false, error: String(err) });
              }
            });
            return;
          }
          next();
        });
      }

      // Saves a base64 image (hero/about photos) under public/site/.
      server.middlewares.use("/api/admin/upload-image", (req, res, next) => {
        if (req.method !== "POST") return next();
        readRequestBody(req).then((body) => {
          try {
            const { dataUrl, slug } = JSON.parse(body);
            const savedPath = saveImage(dataUrl, slug || "foto", siteMediaDir, "/site");
            if (!savedPath) throw new Error("Imagem inválida");
            sendJson(res, 200, { ok: true, path: savedPath });
          } catch (err) {
            sendJson(res, 400, { ok: false, error: String(err) });
          }
        });
      });

      // Saves a raw video file (sent as the request body) under public/videos/.
      server.middlewares.use("/api/admin/upload-video", (req, res, next) => {
        if (req.method !== "POST") return next();
        const rawName = new URL(req.url ?? "", "http://localhost").searchParams.get("filename") || "video.mp4";
        const ext = (rawName.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
        fs.mkdirSync(videosDir, { recursive: true });
        saveCounter += 1;
        const filename = `${slugify(rawName.replace(/\.[^.]+$/, ""))}-${Date.now()}-${saveCounter}.${ext}`;
        const dest = path.join(videosDir, filename);
        let bytesWritten = 0;
        let responded = false;
        const fail = (status: number, error: string) => {
          if (responded) return;
          responded = true;
          fs.rm(dest, { force: true }, () => {});
          sendJson(res, status, { ok: false, error });
        };

        const writeStream = fs.createWriteStream(dest);
        req.on("data", (chunk) => (bytesWritten += chunk.length));
        req.on("aborted", () => fail(400, "Upload interrompido (conexão fechada antes de terminar)."));
        req.on("error", (err) => fail(400, `Erro ao receber o vídeo: ${err.message}`));
        writeStream.on("error", (err) => fail(500, `Erro ao gravar o vídeo em disco: ${err.message}`));
        req.pipe(writeStream);
        writeStream.on("finish", () => {
          if (responded) return;
          responded = true;
          sendJson(res, 200, { ok: true, path: `/videos/${filename}`, bytesWritten });
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
