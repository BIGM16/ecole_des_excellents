"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EtudiantModalProps {
  isOpen: boolean
  onClose: () => void
  etudiant?: any
}

export function EtudiantModal({ isOpen, onClose, etudiant }: EtudiantModalProps) {
  const [formData, setFormData] = useState({
    nom: etudiant?.nom || "",
    email: etudiant?.email || "",
    phone: etudiant?.phone || "",
    niveau: etudiant?.niveau || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{etudiant ? "Modifier l'Étudiant" : "Ajouter un Étudiant"}</DialogTitle>
          <DialogDescription>Remplissez les informations de l'étudiant</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom complet</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Alice Mukendi"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="a.mukendi@student.ede.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+243 818 901 234"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="niveau">Niveau d'études</Label>
            <Select value={formData.niveau} onValueChange={(value) => setFormData({ ...formData, niveau: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3ème année">3ème année</SelectItem>
                <SelectItem value="4ème année">4ème année</SelectItem>
                <SelectItem value="5ème année">5ème année</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{etudiant ? "Mettre à jour" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
