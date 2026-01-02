"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/lib/toast-context";

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
  const { addToast } = useToast();

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
      const response = await fetch(`${API_BASE}/api/auth/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Token expiré, essayer refresh
        await refreshToken();
      } else {
        localStorage.clear();
        setUser(null);
        addToast("error", "Session expirée. Veuillez vous reconnecter.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      localStorage.clear();
      setUser(null);
      addToast("error", "Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      localStorage.clear();
      setUser(null);
      return;
    }

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access);
        await fetchUser(data.access);
      } else {
        localStorage.clear();
        setUser(null);
        addToast("warning", "Session expirée. Veuillez vous reconnecter.");
      }
    } catch (error) {
      console.error("Erreur lors du refresh:", error);
      localStorage.clear();
      setUser(null);
      addToast("error", "Erreur lors du renouvellement de session.");
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.access;
        const refresh = data.refresh;
        localStorage.setItem("token", token);
        if (refresh) localStorage.setItem("refreshToken", refresh);
        await fetchUser(token);
        addToast("success", "Connexion réussie ! Bienvenue.");
        return true;
      }
      addToast(
        "error",
        "Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe."
      );
      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      addToast("error", "Erreur de réseau. Vérifiez votre connexion internet.");
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    addToast("info", "Vous avez été déconnecté.");
    window.location.href = "/";
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
