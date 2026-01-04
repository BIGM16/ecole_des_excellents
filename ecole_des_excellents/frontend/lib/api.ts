const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function fetchWithRefresh(input: RequestInfo, init?: RequestInit) {
  const opts: RequestInit = { credentials: "include", ...init };
  let res = await fetch(input, opts);
  if (res.status === 401) {
    // try refresh via cookie endpoint
    const refreshRes = await fetch(`${API_BASE}/api/token/refresh/cookie/`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      // retry original request
      res = await fetch(input, opts);
    }
  }
  return res;
}

export default fetchWithRefresh;
