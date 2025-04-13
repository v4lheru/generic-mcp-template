import fetch from 'node-fetch';
import { config } from './config';

/**
 * Generic API client for making requests to external services
 */
export class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.apiKey = config.api.key;
  }

  /**
   * Make a GET request to the API
   * @param endpoint - API endpoint to call
   * @param params - Query parameters
   * @param useCache - Whether to use cached results if available
   * @returns Promise with the API response
   */
  async get<T>(endpoint: string, params: Record<string, string> = {}, useCache = true): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const cacheKey = url.toString();
    
    // Check cache if enabled
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < config.api.cacheTtlSeconds * 1000) {
        console.log(`🔄 Using cached result for: ${url}`);
        return cached.data as T;
      }
    }

    try {
      console.log(`🌐 Fetching: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      
      // Cache the result if caching is enabled
      if (useCache) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }
      
      return data as T;
    } catch (error) {
      console.error(`❌ API request failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Make a POST request to the API
   * @param endpoint - API endpoint to call
   * @param body - Request body
   * @returns Promise with the API response
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    try {
      console.log(`🌐 Posting to: ${url}`);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`❌ API request failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Build a URL with query parameters
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns URL object
   */
  private buildUrl(endpoint: string, params: Record<string, string>): URL {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    
    return url;
  }

  /**
   * Get headers for API requests
   * @returns Headers object
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
      // Alternatively, some APIs use different header formats:
      // headers['X-API-Key'] = this.apiKey;
    }
    
    return headers;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 API cache cleared');
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
