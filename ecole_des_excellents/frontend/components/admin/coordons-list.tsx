"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Edit, Trash2, Mail, Phone } from "lucide-react"

const mockCoordons = [
  {
    id: 1,
    nom: "Dr. Jean Mukendi",
    email: "j.mukendi@ede.com",
    phone: "+243 812 345 678",
    niveau: "5ème année",
    etudiants: 45,
    status: "Actif",
  },
  {
    id: 2,
    nom: "Dr. Marie Kabila",
    email: "m.kabila@ede.com",
    phone: "+243 813 456 789",
    niveau: "4ème année",
    etudiants: 52,
    status: "Actif",
  },
  {
    id: 3,
    nom: "Dr. Joseph Tshimanga",
    email: "j.tshimanga@ede.com",
    phone: "+243 814 567 890",
    niveau: "3ème année",
    etudiants: 48,
    status: "Actif",
  },
]

export function CoordonsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCoordons = mockCoordons.filter(
    (coordon) =>
      coordon.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordon.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coordon.niveau.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un coordon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Coordons Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Niveau</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Étudiants</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCoordons.map((coordon) => (
                <tr key={coordon.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{coordon.nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {coordon.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {coordon.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{coordon.niveau}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{coordon.etudiants} étudiants</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">{coordon.status}</Badge>
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
