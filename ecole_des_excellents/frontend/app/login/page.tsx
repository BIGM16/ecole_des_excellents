import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Connexion | École des Excellents",
  description: "Connectez-vous à votre espace membre EDE",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <LoginForm />
      </div>
      <Footer />
    </main>
  )
}
