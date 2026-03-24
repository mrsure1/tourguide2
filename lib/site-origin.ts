/**
 * Auth redirect URLs must match the browser origin (and Supabase Redirect URL allowlist).
 * Prefer proxy headers (Vercel, etc.) over NEXT_PUBLIC_SITE_URL so stale build-time env
 * does not override the actual request host.
 */
export function getSiteOriginFromHeaders(headersList: Headers): string {
  const rawHost =
    headersList.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    headersList.get('host') ||
    '';
  const forwardedProto = headersList.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const isLocalHost =
    rawHost.includes('localhost') ||
    rawHost.startsWith('127.0.0.1');
  const protocol =
    forwardedProto === 'http' || forwardedProto === 'https'
      ? forwardedProto
      : isLocalHost
        ? 'http'
        : 'https';

  if (rawHost) {
    try {
      return new URL(`${protocol}://${rawHost}`).origin;
    } catch {
      /* fall through */
    }
  }

  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      return env.replace(/\/$/, '');
    }
  }

  return 'http://localhost:3000';
}
