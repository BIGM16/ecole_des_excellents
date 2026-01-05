"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/lib/toast-context";
import fetchWithRefresh from "@/lib/api";

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
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Try to fetch current user using cookie-based auth; cookies are sent with credentials
    fetchUser();
  }, []);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  const fetchUser = async () => {
    try {
      const response = await fetchWithRefresh(`${API_BASE}/api/auth/me/`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      localStorage.clear();
      setUser(null);
      addToast(
        "error",
        "Session expirée ou erreur réseau. Veuillez vous reconnecter."
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE}/api/token/cookie/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const payload = await response.json().catch(() => ({}));
        // server sets HttpOnly cookies; fetch current user
        await fetchUser();
        addToast("success", "Connexion réussie.");
        return payload.redirect || "/";
      }
      addToast("error", "Identifiants incorrects.");
      return null;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      addToast("error", "Erreur réseau lors de la connexion.");
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Erreur lors du logout:", e);
    }
    localStorage.clear();
    setUser(null);
    addToast("info", "Vous avez été déconnecté.");
    window.location.href = "/login";
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
