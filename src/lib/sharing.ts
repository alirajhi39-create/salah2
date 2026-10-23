export type StudentShareTarget = {
  status: "public" | "preview" | "invalid" | "pending";
  url: string | null;
};

/** A restricted development preview must never be presented as a public deployment. */
export function isRestrictedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  const restrictedDomains = ["e2b.app", "e2b.dev", "arena.ai", "lmarena.ai", "localhost", "local", "internal", "test", "example", "invalid"];
  if (restrictedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return true;
  if (["example.com", "example.net", "example.org"].some((domain) => host === domain || host.endsWith(`.${domain}`))) return true;
  // IP addresses and single-label hosts aren't suitable canonical share destinations.
  if (!host.includes(".") || host.includes(":")) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return false;
}

export function resolveStudentShareTarget(configuredPublicUrl = "", currentOrigin = ""): StudentShareTarget {
  const candidate = configuredPublicUrl.trim() || currentOrigin.trim();
  if (!candidate) return { status: "pending", url: null };
  try {
    const parsed = new URL(candidate);
    if (isRestrictedHost(parsed.hostname)) return { status: "preview", url: null };
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || !parsed.hostname) {
      return { status: "invalid", url: null };
    }
    // A share link always points to the student route, never /teacher or a temporary token.
    return { status: "public", url: new URL("/student", parsed.origin).toString() };
  } catch {
    return { status: "invalid", url: null };
  }
}
