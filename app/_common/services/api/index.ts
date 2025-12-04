export const API_CONFIG = {
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export interface ApiResponse<T> {
  page: number;
  page_size: number;
  total: number;
  items: T[];
}

export async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      method: "GET",
      headers: API_CONFIG.headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") throw new Error("Request timeout - coba lagi");
      throw new Error(`Network error: ${error.message}`);
    }
    throw new Error("Unknown error occurred");
  }
}
