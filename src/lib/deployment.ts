// Server-side configuration: no secret environment variables are passed to the browser.
export function getConfiguredPublicUrl(): string {
  return (process.env.APP_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || "").trim();
}
