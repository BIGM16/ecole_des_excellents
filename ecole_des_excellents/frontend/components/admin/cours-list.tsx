"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CoursDetailsModal } from "./cours-details-modal"
import { Search, MoreVertical, Edit, Trash2, Users, Clock, Eye } from "lucide-react"

const mockCours = [
  {
    id: 1,
    titre: "Anatomie Générale",
    code: "MED-301",
    niveau: "3ème année",
    encadreur: "Pr. Sarah Mbuyi",
    etudiants: 48,
    heures: 60,
    status: "En cours",
  },
  {
    id: 2,
    titre: "Cardiologie Clinique",
    code: "MED-501",
    niveau: "5ème année",
    encadreur: "Dr. David Kalala",
    etudiants: 35,
    heures: 45,
    status: "En cours",
  },
  {
    id: 3,
    titre: "Pédiatrie Pratique",
    code: "MED-402",
    niveau: "4ème année",
    encadreur: "Dr. Grace Nsimba",
    etudiants: 42,
    heures: 50,
    status: "En cours",
  },
]

export function CoursList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNiveau, setFilterNiveau] = useState("all")
  const [selectedCours, setSelectedCours] = useState<(typeof mockCours)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredCours = mockCours.filter((cours) => {
    const matchesSearch =
      cours.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.encadreur.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesNiveau = filterNiveau === "all" || cours.niveau === filterNiveau
    return matchesSearch && matchesNiveau
  })

  const handleViewDetails = (cours: (typeof mockCours)[0]) => {
    setSelectedCours(cours)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterNiveau} onValueChange={setFilterNiveau}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrer par niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="3ème année">3ème année</SelectItem>
              <SelectItem value="4ème année">4ème année</SelectItem>
              <SelectItem value="5ème année">5ème année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Cours Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Niveau</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Encadreur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Étudiants</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Heures</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCours.map((cours) => (
                <tr
                  key={cours.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(cours)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{cours.titre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{cours.code}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">{cours.niveau}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">{cours.encadreur}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {cours.etudiants}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {cours.heures}h
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">{cours.status}</Badge>
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
                            handleViewDetails(cours)
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

      {/* Modal de détails */}
      <CoursDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedCours(null)
        }}
        cours={selectedCours}
      />
    </div>
  )
}
