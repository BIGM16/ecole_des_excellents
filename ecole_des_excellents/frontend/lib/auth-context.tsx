"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchWithAuth } from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  nom_complet: string;
  promotion: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const response = await fetchWithAuth(`${API_BASE}/api/auth/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const response = await fetchWithAuth(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.access;
        const refresh = data.refresh;
        // store access token for client API calls
        localStorage.setItem("access", token);
        if (refresh) localStorage.setItem("refresh", refresh);
        // also set cookie for Next middleware
        const maxAge = 60 * 30; // 30 minutes
        if (typeof document !== "undefined") {
          document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}`;
        }
        await fetchUser(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
