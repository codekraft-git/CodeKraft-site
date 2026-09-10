import { contactDb } from "@/db/contact";
import { contactSchema } from "@/lib/contact-validation";

const responseHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (body: unknown, status = 200, extraHeaders: Record<string,string> = {}) => Response.json(body, { status, headers: { ...responseHeaders, ...extraHeaders } });

async function digest(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("EMPTY_BODY");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32768) { await reader.cancel(); throw new Error("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(all));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Please submit your brief from the CodeKraft website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ error: "Please use the project form." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 32768) return json({ error: "Your brief is too long. Please shorten it and try again." }, 413);
  let body: unknown;
  try { body = await readBoundedJson(request); }
  catch (error) { return json({ error: error instanceof Error && error.message === "BODY_TOO_LARGE" ? "Your brief is too long. Please shorten it and try again." : "We could not read your brief. Please try again." }, error instanceof Error && error.message === "BODY_TOO_LARGE" ? 413 : 400); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0] || "form")] = issue.message;
    return json({ error: "Please check the highlighted fields.", fields }, 400);
  }
  const data = parsed.data;
  if (data.website) return json({ error: "The form could not be submitted. Please email us directly." }, 400);
  try {
    const db = await contactDb();
    const reference = `CK-${data.requestId.slice(0,8).toUpperCase()}`;
    const existing = await db.prepare("SELECT id FROM contact_submissions WHERE id = ?").bind(data.requestId).first();
    if (existing) return json({ ok: true, reference });
    const now = Date.now();
    const windowStart = Math.floor(now / 3600000) * 3600000;
    // Store only short-lived hashes, never the visitor's raw network address.
    const address = request.headers.get("cf-connecting-ip") || "local";
    const keys = await Promise.all([digest(`network:${windowStart}:${address}`), digest(`email:${windowStart}:${data.email}`)]);
    const results = await db.batch([
      ...keys.map(key => db.prepare("INSERT INTO contact_rate_limits (key, window_start, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET count = contact_rate_limits.count + 1 RETURNING count").bind(key, windowStart)),
      db.prepare("DELETE FROM contact_rate_limits WHERE window_start < ?").bind(windowStart - 3600000),
    ]);
    const networkCount = Number((results[0].results[0] as {count?: number} | undefined)?.count || 0);
    const emailCount = Number((results[1].results[0] as {count?: number} | undefined)?.count || 0);
    if (networkCount > 10 || emailCount > 3) return json({ error: "You have sent several briefs recently. Please try again later or email codekraft.pvt@gmail.com." }, 429, { "Retry-After": String(Math.ceil((windowStart + 3600000 - now) / 1000)) });
    await db.prepare("INSERT INTO contact_submissions (id, name, email, company, project_type, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'new', ?) ON CONFLICT(id) DO NOTHING")
      .bind(data.requestId, data.name, data.email, data.company, data.projectType, data.message, now).run();
    return json({ ok: true, reference }, 201);
  } catch {
    // Avoid putting enquiry contents or contact information into operational logs.
    console.error("CodeKraft contact submission storage unavailable");
    return json({ error: "We could not save your brief right now. Your details are still in the form. Please try again, or email codekraft.pvt@gmail.com." }, 503);
  }
}
