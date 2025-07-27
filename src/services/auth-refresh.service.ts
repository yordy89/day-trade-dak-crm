import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/storage';

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
  expiresIn?: number;
}

class AuthRefreshService {
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshPromise: Promise<string | null> | null = null;

  /**
   * Start auto-refresh timer
   * Refreshes token 5 minutes before expiration
   */
  startAutoRefresh(expiresIn = 3600) {
    this.stopAutoRefresh();

    // Refresh 5 minutes before expiration
    const refreshTime = (expiresIn - 300) * 1000;
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }

  /**
   * Stop auto-refresh timer
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Refresh the access token
   */
  async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performRefresh(): Promise<string | null> {
    const refreshToken = getLocalStorage('refresh_token');
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data: RefreshResponse = await response.json();
      
      // Update stored tokens
      setLocalStorage('access_token', data.access_token);
      if (data.refresh_token) {
        setLocalStorage('refresh_token', data.refresh_token);
      }

      // Restart auto-refresh timer
      if (data.expiresIn) {
        this.startAutoRefresh(data.expiresIn);
      }

      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      removeLocalStorage('access_token');
      removeLocalStorage('refresh_token');
      removeLocalStorage('user');
      return null;
    }
  }

  /**
   * Check if token is expired or about to expire
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      // Consider token expired if less than 1 minute remaining
      return currentTime >= expirationTime - 60000;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  /**
   * Intercept fetch to auto-refresh on 401
   */
  createAuthenticatedFetch() {
    const originalFetch = window.fetch;
    
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // First attempt
      let response = await originalFetch(input, init);
      
      // If unauthorized, try refreshing token
      if (response.status === 401) {
        const newToken = await this.refreshToken();
        
        if (newToken && init?.headers) {
          // Retry with new token
          const headers = new Headers(init.headers);
          headers.set('Authorization', `Bearer ${newToken}`);
          
          response = await originalFetch(input, {
            ...init,
            headers,
          });
        }
      }
      
      return response;
    };
  }
}

export const authRefreshService = new AuthRefreshService();

// Export authenticated fetch
export const authenticatedFetch = authRefreshService.createAuthenticatedFetch();