"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EncadreurModalProps {
  isOpen: boolean
  onClose: () => void
  encadreur?: any
}

export function EncadreurModal({ isOpen, onClose, encadreur }: EncadreurModalProps) {
  const [formData, setFormData] = useState({
    nom: encadreur?.nom || "",
    email: encadreur?.email || "",
    phone: encadreur?.phone || "",
    specialite: encadreur?.specialite || "",
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
          <DialogTitle>{encadreur ? "Modifier l'Encadreur" : "Ajouter un Encadreur"}</DialogTitle>
          <DialogDescription>Remplissez les informations de l'encadreur</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom complet</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Pr. Sarah Mbuyi"
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
              placeholder="s.mbuyi@ede.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+243 815 678 901"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité</Label>
            <Select
              value={formData.specialite}
              onValueChange={(value) => setFormData({ ...formData, specialite: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une spécialité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cardiologie">Cardiologie</SelectItem>
                <SelectItem value="Neurologie">Neurologie</SelectItem>
                <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                <SelectItem value="Chirurgie">Chirurgie</SelectItem>
                <SelectItem value="Anatomie">Anatomie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{encadreur ? "Mettre à jour" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
