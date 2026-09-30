export const ADMIN_SESSION_COOKIE = 'plant_shop_api_session';

export const ADMIN_ROLES = ['OWNER', 'SALES', 'EDITOR'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminSessionClaims = {
  userId: string;
  role: AdminRole;
  exp: number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret = process.env.AUTH_SECRET,
): Promise<AdminSessionClaims | null> {
  if (!token || !secret || secret.length < 32) return null;

  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const validSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(signature),
      new TextEncoder().encode(payload),
    );
    if (!validSignature) return null;

    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload))) as AdminSessionClaims;
    if (
      typeof claims.userId !== 'string' ||
      !ADMIN_ROLES.includes(claims.role) ||
      !Number.isFinite(claims.exp) ||
      claims.exp <= Date.now()
    ) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}
