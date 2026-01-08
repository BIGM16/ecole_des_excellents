"use client";

import { useEffect, useState } from "react";
import fetchWithRefresh from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoursDetailsModal } from "./cours-details-modal";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Clock,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export function CoursList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("all");
  const [cours, setCours] = useState<any[]>([]);
  const [selectedCours, setSelectedCours] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const loadCours = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRefresh(`${API_BASE}/api/administrateurs/cours/search/`);
      if (res.ok) {
        const data = await res.json();
        setCours(Array.isArray(data.results) ? data.results : []);
      } else {
        addToast("error", "Erreur lors du chargement des cours");
      }
    } catch (e) {
      console.error(e);
      addToast("error", "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCours();
  }, []);

  const handleViewDetails = (c: any) => {
    setSelectedCours(c);
    setIsDetailsOpen(true);
  };

  const filteredCours = cours.filter((c) => {
    const matchesSearch =
      (c.titre || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (c.code || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (c.encadreur || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesNiveau =
      filterNiveau === "all" || (c.niveau || "") === filterNiveau;
    return matchesSearch && matchesNiveau;
  });

  return (
    <div className="space-y-4">
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Cours
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Niveau
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Encadreur
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Étudiants
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Heures
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCours.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(c)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{c.titre}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{c.code}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {c.niveau}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {c.encadreur}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {c.etudiants ?? "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {c.heures ?? "-"}h
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">
                      {c.status ?? "-"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(c);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-sm text-muted-foreground"
                  >
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && filteredCours.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-sm text-muted-foreground"
                  >
                    Aucun cours trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CoursDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedCours(null);
        }}
        cours={selectedCours}
      />
    </div>
  );
}
