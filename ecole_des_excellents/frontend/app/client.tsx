"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
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

  // Note: We don't auto-redirect logged-in users anymore.
  // Users can access the home page regardless of login status.
  // They can manually navigate to their dashboard if they want.

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  // Display public home page for everyone
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
