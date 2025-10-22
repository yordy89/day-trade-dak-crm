// Secure cookie utilities for client-side usage with GDPR compliance

export interface CookieOptions {
  expires?: number; // Days until expiration
  path?: string;
  secure?: boolean; // Only send over HTTPS
  sameSite?: 'strict' | 'lax' | 'none'; // CSRF protection
  httpOnly?: boolean; // Not accessible via JavaScript (server-side only)
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (const cookie of ca) {
    let c = cookie;
    while (c.startsWith(' ')) c = c.substring(1);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') return;

  let cookieString = `${name}=${encodeURIComponent(value || "")}`;

  // Add expiration
  if (options.expires) {
    const date = new Date();
    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }

  // Add path
  const path = options.path || "/";
  cookieString += `; path=${path}`;

  // Add Secure flag (HTTPS only) - default to true in production
  const secure = options.secure !== undefined
    ? options.secure
    : process.env.NODE_ENV === 'production';
  if (secure) {
    cookieString += '; Secure';
  }

  // Add SameSite flag (CSRF protection) - default to Lax
  const sameSite = options.sameSite || 'Lax';
  cookieString += `; SameSite=${sameSite}`;

  // Note: HttpOnly cannot be set from JavaScript (only server-side)
  // For auth tokens, use server-side cookies with HttpOnly flag

  document.cookie = cookieString;
}

export function deleteCookie(name: string, options: { path?: string } = {}) {
  if (typeof document === 'undefined') return;

  const path = options.path || '/';
  document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}