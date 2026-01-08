"use client";

import { useEffect, useState } from "react";
import fetchWithRefresh from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EncadreurDetailsModal } from "./encadreur-details-modal";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Eye,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export function EncadreursList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [encadreurs, setEncadreurs] = useState<any[]>([]);
  const [selectedEncadreur, setSelectedEncadreur] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const loadEncadreurs = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRefresh(`${API_BASE}/api/encadreurs/`);
      if (res.ok) {
        const data = await res.json();
        setEncadreurs(Array.isArray(data) ? data : []);
      } else {
        addToast("error", "Erreur lors du chargement des encadreurs");
      }
    } catch (e) {
      console.error(e);
      addToast("error", "Erreur réseau lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEncadreurs();
  }, []);

  const handleViewDetails = (encadreur: any) => {
    setSelectedEncadreur(encadreur);
    setIsDetailsOpen(true);
  };

  const filtered = encadreurs.filter(
    (enc) =>
      (enc.nom || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (enc.email || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (enc.specialite || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Spécialité
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Étudiants
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Cours
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
              {filtered.map((encadreur) => (
                <tr
                  key={encadreur.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {encadreur.nom}
                    </div>
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
                    <div className="text-sm font-medium text-foreground">
                      {encadreur.etudiants ?? "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {encadreur.cours ?? "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-primary/10 text-primary">
                      {encadreur.status ?? "Actif"}
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
                            handleViewDetails(encadreur);
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
                    colSpan={7}
                    className="p-4 text-center text-sm text-muted-foreground"
                  >
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-sm text-muted-foreground"
                  >
                    Aucun encadreur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <EncadreurDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedEncadreur(null);
        }}
        encadreur={selectedEncadreur}
      />
    </div>
  );
}
