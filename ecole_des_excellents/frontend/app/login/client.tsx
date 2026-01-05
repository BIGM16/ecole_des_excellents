"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function LoginPageClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Rediriger selon le rôle
      switch (user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "encadreur":
          router.push("/encadreur");
          break;
        case "etudiant":
          router.push("/etudiant");
          break;
        default:
          router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="h-full flex bg-background align-center jusitify-center text-center text-3xl">Chargement...</div>;
  }

  if (!loading && user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <LoginForm />
      </div>
      <Footer />
    </main>
  );
}
