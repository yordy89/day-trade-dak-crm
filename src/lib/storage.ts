/**
 * Local storage utility functions with type safety and error handling
 */

/**
 * Get item from localStorage
 */
export function getLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setLocalStorage(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}