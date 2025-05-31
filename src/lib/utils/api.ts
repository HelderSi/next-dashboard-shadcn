// lib/utils/getApiUrl.ts
export function getApiUrl(endpoint = ""): string {
  // === BROWSER: always relative ===
  if (typeof window !== "undefined") {
    return `/api/${endpoint.replace(/^\/+/, "")}`;
  }

  // === SERVER: build absolute URL ===
  // 1) Prefer an env var you set in your env files
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
    // 2) Fallback to NextAuth-style URL if you're already using that
    ?? process.env.NEXTAUTH_URL
    // 3) Local development fallback
    ?? `http://localhost:${process.env.PORT || 3000}`;

  return new URL(`/api/${endpoint.replace(/^\/+/, "")}`, base).toString();
}