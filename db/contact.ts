import { env } from "cloudflare:workers";

export function contactDb(): D1Database {
  if (!env.DB) throw new Error("CONTACT_STORAGE_UNAVAILABLE");
  return env.DB;
}
