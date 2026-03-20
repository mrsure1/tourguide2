export function clearChannelTalkSessionCookie() {
  if (typeof document === "undefined") return;

  // 채널톡이 브라우저에 남긴 세션 쿠키를 가능한 범위에서 모두 삭제합니다.
  const cookieName = "ch-session";
  const base = `${cookieName}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  const hostname = window.location.hostname;
  const candidates = [""];

  if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
    candidates.push(`; domain=${hostname}`);

    if (hostname.includes(".")) {
      candidates.push(`; domain=.${hostname}`);

      const parts = hostname.split(".");
      if (parts.length > 2) {
        candidates.push(`; domain=.${parts.slice(1).join(".")}`);
      }
    }
  }

  for (const domainPart of candidates) {
    document.cookie = `${base}${domainPart}`;
  }
}
