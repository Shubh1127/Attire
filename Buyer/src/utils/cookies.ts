/**
 * Sets a cookie with the given name, value, and expiration days
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until the cookie expires
 */
export const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };
  
  /**
   * Gets the value of a cookie by name
   * @param name - Cookie name to retrieve
   * @returns The cookie value or null if not found
   */
  export const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  };
  
  /**
   * Deletes a cookie by name
   * @param name - Cookie name to delete
   */
  export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };
  
  /**
   * Cookie utility object with typed methods
   */
  export const cookie = {
    set: setCookie,
    get: getCookie,
    delete: deleteCookie,
  };