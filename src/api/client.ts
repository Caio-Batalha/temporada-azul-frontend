const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

type ApiError = {
  status: number;
  message: string;
  detail?: unknown;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let detail: unknown = null;
    try {
      detail = await response.json();
    } catch {
      detail = null;
    }

    const error: ApiError = {
      status: response.status,
      message: "Request failed",
      detail,
    };

    throw error;
  }

  return response.json() as Promise<T>;
}

export { apiFetch, API_URL };
export type { ApiError };
