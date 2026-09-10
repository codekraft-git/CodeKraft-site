export async function contactDb(): Promise<D1Database> {
  try {
    const mod = await import("cloudflare:workers");
    if (!mod.env?.DB) throw new Error("CONTACT_STORAGE_UNAVAILABLE");
    return mod.env.DB;
  } catch {
    throw new Error("CONTACT_STORAGE_UNAVAILABLE");
  }
}
