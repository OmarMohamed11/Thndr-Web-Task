/// <reference types="vite/client" />

const API_BASE_URL = "https://api.polygon.io";
const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

// Rate limit cooldown management
let rateLimitCooldownUntil: number | null = null;
const RATE_LIMIT_COOLDOWN_MS = 60 * 1000; // 1 minute

function isRateLimited(): boolean {
  if (rateLimitCooldownUntil === null) {
    return false;
  }

  const now = Date.now();
  if (now >= rateLimitCooldownUntil) {
    rateLimitCooldownUntil = null;
    return false;
  }

  return true;
}

function setRateLimitCooldown(): void {
  rateLimitCooldownUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
}

function getRemainingCooldownMs(): number {
  if (rateLimitCooldownUntil === null) {
    return 0;
  }

  const remaining = rateLimitCooldownUntil - Date.now();
  return Math.max(0, remaining);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class RateLimitError extends ApiError {
  public readonly cooldownMs: number;

  constructor(
    message: string = "Rate limit exceeded. Please wait before making another request.",
    cooldownMs: number = RATE_LIMIT_COOLDOWN_MS
  ) {
    super(message, 429, "Too Many Requests");
    this.name = "RateLimitError";
    this.cooldownMs = cooldownMs;
  }
}

async function fetchWithHandling<T>(url: string): Promise<T> {
  // Check if we're currently in rate limit cooldown
  if (isRateLimited()) {
    const remainingMs = getRemainingCooldownMs();
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    throw new RateLimitError(
      `Rate limit cooldown active. Please wait ${remainingSeconds.toString()} seconds before making another request.`,
      remainingMs
    );
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        // Set cooldown when we hit rate limit
        setRateLimitCooldown();
        throw new RateLimitError(
          `Rate limit exceeded. Please wait 1 minute before making another request.`
        );
      }
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data: unknown = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed"
    );
  }
}

export async function apiClient<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  url.searchParams.append("apiKey", API_KEY);

  return fetchWithHandling<T>(url.toString());
}

export async function fetchFromUrl<T>(url: string): Promise<T> {
  // If the url already has query params, append with &, else with ?
  const separator = url.includes("?") ? "&" : "?";
  const fullUrl = `${url}${separator}apiKey=${API_KEY}`;
  return fetchWithHandling<T>(fullUrl);
}

// Utility functions for rate limit status
export function getRateLimitStatus(): {
  isRateLimited: boolean;
  remainingCooldownMs: number;
  remainingCooldownSeconds: number;
} {
  const remainingMs = getRemainingCooldownMs();
  return {
    isRateLimited: isRateLimited(),
    remainingCooldownMs: remainingMs,
    remainingCooldownSeconds: Math.ceil(remainingMs / 1000),
  };
}

export function clearRateLimitCooldown(): void {
  rateLimitCooldownUntil = null;
}
