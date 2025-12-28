"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EncadreurDetailsModal } from "./encadreur-details-modal"
import { Search, MoreVertical, Edit, Trash2, Mail, Phone, Eye } from "lucide-react"

const mockEncadreurs = [
  {
    id: 1,
    nom: "Pr. Sarah Mbuyi",
    email: "s.mbuyi@ede.com",
    phone: "+243 815 678 901",
    specialite: "Cardiologie",
    etudiants: 12,
    cours: 3,
    status: "Actif",
  },
  {
    id: 2,
    nom: "Dr. David Kalala",
    email: "d.kalala@ede.com",
    phone: "+243 816 789 012",
    specialite: "Neurologie",
    etudiants: 15,
    cours: 4,
    status: "Actif",
  },
  {
    id: 3,
    nom: "Dr. Grace Nsimba",
    email: "g.nsimba@ede.com",
    phone: "+243 817 890 123",
    specialite: "Pédiatrie",
    etudiants: 10,
    cours: 2,
    status: "Actif",
  },
]

export function EncadreursList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEncadreur, setSelectedEncadreur] = useState<(typeof mockEncadreurs)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredEncadreurs = mockEncadreurs.filter(
    (encadreur) =>
      encadreur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encadreur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encadreur.specialite.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (encadreur: (typeof mockEncadreurs)[0]) => {
    setSelectedEncadreur(encadreur)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un encadreur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Encadreurs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Spécialité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Étudiants</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEncadreurs.map((encadreur) => (
                <tr
                  key={encadreur.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(encadreur)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{encadreur.nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {encadreur.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {encadreur.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{encadreur.specialite}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{encadreur.etudiants}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{encadreur.cours}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">{encadreur.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails(encadreur)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Encadreur Details Modal */}
      <EncadreurDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedEncadreur(null)
        }}
        encadreur={selectedEncadreur}
      />
    </div>
  )
}
