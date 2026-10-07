// Storage abstraction: Strategy pattern.
// Service layer bergantung pada interface FileStorage ini (Dependency Inversion),
// bukan pada implementasi lokal/cloud secara langsung — supaya gampang di-swap
// antara development (lokal) dan production (Vercel Blob / Cloudflare R2).
//
// `url` yang dikembalikan upload() disimpan di Article.fileUrl dan TIDAK PERNAH dikirim ke
// browser. Berkas hanya disajikan lewat /api/articles/[id]/download, yang memeriksa status
// karya (NFR-SEC-04).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredFile =
  | { kind: "data"; data: Buffer; contentType: string }
  | { kind: "redirect"; url: string };

export interface FileStorage {
  upload(file: Buffer, path: string): Promise<{ url: string }>;
  delete(path: string): Promise<void>;
  /** Buka berkas berdasarkan `url` hasil upload() (atau URL http(s) eksternal). */
  open(url: string): Promise<StoredFile>;
}

const LOCAL_PREFIX = "local:";
const isHttpUrl = (url: string) => /^https?:\/\//i.test(url);

// Berkas lokal disimpan di folder privat (di luar /public) supaya tidak bisa diakses
// langsung lewat URL.
const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), ".uploads"));

// Cegah path traversal: hasil resolve harus tetap berada di dalam UPLOAD_ROOT.
function resolveSafe(key: string): string {
  const full = path.resolve(UPLOAD_ROOT, key);
  if (full !== UPLOAD_ROOT && !full.startsWith(UPLOAD_ROOT + path.sep)) {
    throw new Error("Path berkas tidak valid.");
  }
  return full;
}

export class LocalStorage implements FileStorage {
  async upload(file: Buffer, key: string): Promise<{ url: string }> {
    const full = resolveSafe(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file);
    return { url: `${LOCAL_PREFIX}${key}` };
  }

  async delete(key: string): Promise<void> {
    await rm(resolveSafe(key), { force: true });
  }

  async open(url: string): Promise<StoredFile> {
    if (isHttpUrl(url)) return { kind: "redirect", url };
    if (!url.startsWith(LOCAL_PREFIX)) throw new Error("Format fileUrl tidak dikenali.");
    const data = await readFile(resolveSafe(url.slice(LOCAL_PREFIX.length)));
    return { kind: "data", data, contentType: "application/pdf" };
  }
}

export class CloudStorage implements FileStorage {
  async upload(_file: Buffer, path: string): Promise<{ url: string }> {
    // TODO: integrasikan dengan Vercel Blob atau Cloudflare R2 di production.
    throw new Error(`CloudStorage.upload belum diimplementasikan untuk path: ${path}`);
  }

  async delete(_path: string): Promise<void> {
    // TODO: hapus object dari bucket.
  }

  async open(url: string): Promise<StoredFile> {
    // Berkas lama yang sudah berupa URL http(s) cukup di-redirect.
    if (isHttpUrl(url)) return { kind: "redirect", url };
    throw new Error("CloudStorage.open belum diimplementasikan.");
  }
}

// Pilih strategi berdasarkan environment — bagian ini satu-satunya tempat
// yang perlu tahu perbedaan lokal vs cloud.
export const storage: FileStorage =
  process.env.NODE_ENV === "production" ? new CloudStorage() : new LocalStorage();
