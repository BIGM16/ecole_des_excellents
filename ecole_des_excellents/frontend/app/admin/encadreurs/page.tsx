"use client"

import { useState } from "react"
import { EncadreursList } from "@/components/admin/encadreurs-list"
import { EncadreurModal } from "@/components/admin/encadreur-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EncadreursPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-serif">Gestion des Encadreurs</h1>
          <p className="text-muted-foreground">Administration de l'équipe pédagogique</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-5 w-5" />
          Ajouter un Encadreur
        </Button>
      </div>

      <EncadreursList />
      <EncadreurModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
