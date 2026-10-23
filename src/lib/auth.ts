import { createHmac } from "node:crypto";

export function normalizePassword(value: string) {
  return value
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\u200b]/g, "")
    .trim()
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

export function acceptedPasswords(): string[] {
  const configured = [process.env.TEACHER_PASSWORD, process.env.ali_rajhi, process.env.ALI_RAJHI]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => normalizePassword(v.replace(/^"(.*)"$/, "$1")));
  // A configured password replaces demo access; never leave a known backdoor on a public deployment.
  if (configured.length > 0) return Array.from(new Set(configured));
  if (process.env.RENDER || process.env.VERCEL || process.env.APP_PUBLIC_URL) return [];
  return ["1234"];
}

function decodeHeader(raw: string) {
  const candidates = new Set<string>([raw]);
  try {
    candidates.add(decodeURIComponent(raw));
  } catch {}
  try {
    candidates.add(Buffer.from(raw, "latin1").toString("utf8"));
  } catch {}
  return Array.from(candidates);
}

export function isTeacher(req: Request) {
  const given = req.headers.get("x-teacher-password");
  if (!given) return false;
  const accepted = acceptedPasswords();
  return decodeHeader(given).some((v) => accepted.includes(normalizePassword(v)));
}

export function tokenFor(password: string) {
  const secret = process.env.AUTH_SECRET || process.env.DATABASE_URL;
  if (!secret) throw new Error("AUTH_SECRET or DATABASE_URL is required");
  return createHmac("sha256", secret).update("teacher:" + normalizePassword(password)).digest("hex");
}

export function verifyCredentials(body: { password?: unknown; token?: unknown }): string | null {
  const accepted = acceptedPasswords();
  if (typeof body.password === "string") {
    const pw = normalizePassword(body.password);
    if (accepted.includes(pw)) return tokenFor(pw);
  }
  if (typeof body.token === "string" && accepted.map(tokenFor).includes(body.token)) return body.token;
  return null;
}
