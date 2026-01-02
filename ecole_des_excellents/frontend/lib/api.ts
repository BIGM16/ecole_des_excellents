const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const access = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: access ? `Bearer ${access}` : "",
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 401) {
    return response;
  }

  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) {
    throw new Error("No refresh token");
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => {
          resolve(
            fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          );
        },
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshResponse.ok) {
      throw new Error("Refresh failed");
    }

    const data = await refreshResponse.json();
    localStorage.setItem("token", data.access);

    processQueue(null, data.access);
    isRefreshing = false;

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.access}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    processQueue(error, null);
    isRefreshing = false;
    localStorage.clear();
    window.location.href = "/login";
    throw error;
  }
}
                            },
                        })
                    );
                },
                reject,
            });
        });
    }

    });
  }

  isRefreshing = true;

  try {
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshResponse.ok) {
      throw new Error("Refresh failed");
    }

    const data = await refreshResponse.json();
    localStorage.setItem("token", data.access);

    processQueue(null, data.access);
    isRefreshing = false;

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.access}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    processQueue(error, null);
    isRefreshing = false;
    localStorage.clear();
    window.location.href = "/login";
    throw error;
  }
}