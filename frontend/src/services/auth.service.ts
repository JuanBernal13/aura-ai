const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("aura_token") : null;
  
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Server error");
  }

  return response.json();
}

export const authService = {
  token: async (formData: FormData) => {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Invalid credentials" }));
      throw new Error(error.detail || "Login failed");
    }
    
    return response.json();
  },
  
  registration: async (data: any) => {
    return apiRequest("/auth/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async () => {
    return apiRequest("/users/me");
  }
};
