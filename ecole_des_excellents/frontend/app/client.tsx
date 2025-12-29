"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { StatsSection } from "@/components/stats-section";
import { AchievementsSection } from "@/components/achievements-section";
import { HierarchySection } from "@/components/hierarchy-section";
import { Footer } from "@/components/footer";

export function HomeClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Rediriger vers le dashboard selon le rôle
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
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  // Si pas connecté, afficher la page publique
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <AchievementsSection />
      <HierarchySection />
      <Footer />
    </main>
  );
}
