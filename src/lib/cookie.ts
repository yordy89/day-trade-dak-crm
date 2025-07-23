// Simple cookie utilities for client-side usage
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

export function setCookie(name: string, value: string, options: { expires?: number; path?: string } = {}) {
  if (typeof document === 'undefined') return;
  
  let expires = "";
  if (options.expires) {
    const date = new Date();
    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  const path = options.path || "/";
  document.cookie = `${name}=${value || ""}${expires}; path=${path}`;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}