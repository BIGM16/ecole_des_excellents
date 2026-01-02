const API_URL = "http://localhost:8000/api";

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string |null = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        }else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

export async function fetchWithAuth(
    endpoint:string,
    options: RequestInit = {}
) {
    const access = localStorage.getItem("access");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: access ? `Bearer ${access}` : "",
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 401){
        return response;
    }

    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
        throw new Error("No refresh token");
    }

    if (isRefreshing) {
        return new Promise((resolve, rejet) =>{
            failedQueue.push({
                resolve: (token: string) =>{
                    resolve(
                        fetchWithAuth(endpoint, {
                            ...options,
                            headers: {
                                ...options.headers,
                                Authorization: `Bearer ${token}`,
                            },
                        })
                    );
                },
                reject,
            });
        });
    }

    isRefreshing= True;

    try{
        const refreshResponse = await fetch(`${API_URL}/auth/refresh/`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({ refresh }),
        });

        if(!refreshResponse.ok) {
            throw new Error("Refresh failed");
        }

        const data = await refreshResponse.json();
        localStorage.setItem("access", data.access);

        processQueue(null, data.access);
        isRefreshing = false;

        return fetchWithAuth(endpoint, options);
    } catch (error) {
        processQueue(error, null);
        isRefreshing = false;
        localStorage.clear();
        window.location.href="/login";
        throw error;
    }
}