import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { AchievementsSection } from "@/components/achievements-section"
import { HierarchySection } from "@/components/hierarchy-section"
import { Footer } from "@/components/footer"

export default function Home() {
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
  )
}
