"use client"

import { useState } from "react"
import { EtudiantsList } from "@/components/admin/etudiants-list"
import { EtudiantModal } from "@/components/admin/etudiant-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EtudiantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-serif">Gestion des Étudiants</h1>
          <p className="text-muted-foreground">Suivi et administration des étudiants de l'EDE</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-5 w-5" />
          Ajouter un Étudiant
        </Button>
      </div>

      <EtudiantsList />
      <EtudiantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
