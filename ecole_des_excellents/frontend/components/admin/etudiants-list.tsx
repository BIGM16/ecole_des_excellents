"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreVertical, Edit, Trash2, Mail, Phone, Download } from "lucide-react"

const mockEtudiants = [
  {
    id: 1,
    nom: "Alice Mukendi",
    email: "a.mukendi@student.ede.com",
    phone: "+243 818 901 234",
    niveau: "5ème année",
    moyenne: 16.5,
    status: "Excellent",
  },
  {
    id: 2,
    nom: "Bob Kabila",
    email: "b.kabila@student.ede.com",
    phone: "+243 819 012 345",
    niveau: "4ème année",
    moyenne: 14.2,
    status: "Très Bien",
  },
  {
    id: 3,
    nom: "Claire Nsimba",
    email: "c.nsimba@student.ede.com",
    phone: "+243 820 123 456",
    niveau: "3ème année",
    moyenne: 15.8,
    status: "Excellent",
  },
]

export function EtudiantsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNiveau, setFilterNiveau] = useState("all")

  const filteredEtudiants = mockEtudiants.filter((etudiant) => {
    const matchesSearch =
      etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesNiveau = filterNiveau === "all" || etudiant.niveau === filterNiveau
    return matchesSearch && matchesNiveau
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un étudiant..."
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
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </Card>

      {/* Étudiants Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Niveau</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Moyenne</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Performance</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEtudiants.map((etudiant) => (
                <tr key={etudiant.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{etudiant.nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {etudiant.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {etudiant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{etudiant.niveau}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{etudiant.moyenne}/20</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        etudiant.status === "Excellent" ? "bg-primary/10 text-primary" : "bg-chart-2/10 text-chart-2"
                      }
                    >
                      {etudiant.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
    </div>
  )
}
