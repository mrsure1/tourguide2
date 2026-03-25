type RoleLike = {
  role?: string | null;
};

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export function getEffectiveRole(role?: string | null, email?: string | null) {
  return isAdminEmail(email) ? "admin" : role ?? null;
}

export function isAdminProfile(profile: RoleLike | null | undefined, email?: string | null) {
  return getEffectiveRole(profile?.role, email) === "admin";
}

export function applyAdminProfileOverride<T extends RoleLike>(profile: T | null | undefined, email?: string | null) {
  if (!isAdminEmail(email)) {
    return profile ?? null;
  }

  return {
    ...(profile ?? {}),
    role: "admin",
    isAdmin: true,
  } as (T & { isAdmin: boolean; role: "admin" }) | { isAdmin: boolean; role: "admin" };
}
