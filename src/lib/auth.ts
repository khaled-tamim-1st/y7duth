import type { AstroCookies } from 'astro';

const SESSION_COOKIE_NAME = 'kuwait_admin_session';
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'kuwait-happening-secret-2026';

export interface AdminSession {
  username: string;
  name: string;
  role: string;
  loggedInAt: number;
}

export function createSessionToken(session: AdminSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64');
  // Simple HMAC-like signature
  const signature = Buffer.from(`${payload}:${SECRET_KEY}`).toString('base64');
  return `${payload}.${signature}`;
}

export function parseSessionToken(token: string): AdminSession | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSig = Buffer.from(`${payload}:${SECRET_KEY}`).toString('base64');
    if (signature !== expectedSig) return null;

    const json = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(json) as AdminSession;
  } catch {
    return null;
  }
}

export function setSessionCookie(cookies: AstroCookies, session: AdminSession) {
  const token = createSessionToken(session);
  cookies.set(SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function getSession(cookies: AstroCookies): AdminSession | null {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return parseSessionToken(token);
}

export function requireAuth(cookies: AstroCookies): AdminSession | null {
  return getSession(cookies);
}
