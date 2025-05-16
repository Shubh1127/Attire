/**
 * Sets a secure cookie with the given name, value, and options
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options (days, secure, sameSite, domain)
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    days?: number;
    secure?: boolean;
    sameSite?: 'Lax' | 'Strict' | 'None';
    domain?: string;
  } = {}
): void => {
  const { days = 7, secure = true, sameSite = 'Lax', domain } = options;
  
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  
  let cookie = `${name}=${value};`;
  cookie += `expires=${date.toUTCString()};`;
  cookie += `path=/;`;
  cookie += `sameSite=${sameSite};`;
  
  if (secure) {
    cookie += 'secure;';
  }
  
  if (domain) {
    cookie += `domain=${domain};`;
  }
  
  document.cookie = cookie;
};

/**
 * Gets the value of a cookie by name
 * @param name - Cookie name to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // SSR support
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

/**
 * Deletes a cookie by name
 * @param name - Cookie name to delete
 * @param options - Additional options (domain, path)
 */
export const deleteCookie = (
  name: string,
  options: { domain?: string; path?: string } = {}
): void => {
  const { domain, path = '/' } = options;
  
  let cookie = `${name}=;`;
  cookie += `expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  cookie += `path=${path};`;
  
  if (domain) {
    cookie += `domain=${domain};`;
  }
  
  document.cookie = cookie;
  
  // Additional cleanup for older browsers
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (domain) {
    document.cookie = `${name}=; path=${path}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

/**
 * Cookie utility object with typed methods
 */
export const cookie = {
  set: setCookie,
  get: getCookie,
  delete: deleteCookie,
};