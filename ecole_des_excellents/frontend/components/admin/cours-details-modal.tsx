"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Users, Clock, GraduationCap, FileText, Download, Calendar, Video, Award } from "lucide-react"

interface CoursDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  cours: {
    id: number
    titre: string
    code: string
    niveau: string
    encadreur: string
    etudiants: number
    heures: number
    status: string
    description?: string
    objectifs?: string[]
    encadreurs?: Array<{ nom: string; role: string }>
    fichiers?: Array<{ nom: string; type: string; taille: string; date: string }>
    horaire?: string
    salle?: string
    tauxPresence?: number
  } | null
}

export function CoursDetailsModal({ isOpen, onClose, cours }: CoursDetailsModalProps) {
  if (!cours) return null

  // Mock data enrichi
  const detailsComplets = {
    ...cours,
    description:
      cours.description ||
      "Ce cours approfondit les concepts fondamentaux et avancés de la discipline, avec une approche théorique et pratique. Les étudiants développeront des compétences essentielles à travers des études de cas et des travaux pratiques.",
    objectifs: cours.objectifs || [
      "Maîtriser les concepts théoriques fondamentaux",
      "Développer des compétences pratiques en situation clinique",
      "Analyser et résoudre des cas complexes",
      "Collaborer efficacement en équipe médicale",
    ],
    encadreurs: cours.encadreurs || [
      { nom: cours.encadreur, role: "Professeur Titulaire" },
      { nom: "Dr. Jean Mukendi", role: "Assistant" },
      { nom: "Dr. Marie Kabongo", role: "Chargé de TP" },
    ],
    fichiers: cours.fichiers || [
      { nom: "Syllabus " + cours.titre + ".pdf", type: "PDF", taille: "2.4 MB", date: "15 Jan 2025" },
      { nom: "Slides Chapitre 1.pptx", type: "PPTX", taille: "8.7 MB", date: "18 Jan 2025" },
      { nom: "TP - Cas Cliniques.pdf", type: "PDF", taille: "1.2 MB", date: "22 Jan 2025" },
      { nom: "Examens Blancs.pdf", type: "PDF", taille: "890 KB", date: "25 Jan 2025" },
      { nom: "Références Bibliographiques.docx", type: "DOCX", taille: "156 KB", date: "28 Jan 2025" },
    ],
    horaire: cours.horaire || "Mardi 8h00-10h00, Jeudi 14h00-16h00",
    salle: cours.salle || "Amphithéâtre B - Bâtiment Médical",
    tauxPresence: cours.tauxPresence || 92,
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄"
      case "PPTX":
        return "📊"
      case "DOCX":
        return "📝"
      default:
        return "📎"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground font-serif flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            Détails du Cours
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* En-tête avec infos principales */}
          <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{detailsComplets.titre}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{detailsComplets.code}</Badge>
                  <Badge className="bg-primary/10 text-primary">{detailsComplets.niveau}</Badge>
                  <Badge
                    className={
                      detailsComplets.status === "En cours"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-gray-500/10 text-gray-600"
                    }
                  >
                    {detailsComplets.status}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{detailsComplets.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{detailsComplets.horaire}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Video className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{detailsComplets.salle}</span>
              </div>
            </div>
          </Card>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{detailsComplets.etudiants}</p>
                  <p className="text-xs text-muted-foreground">Étudiants</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{detailsComplets.heures}h</p>
                  <p className="text-xs text-muted-foreground">Volume</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{detailsComplets.encadreurs.length}</p>
                  <p className="text-xs text-muted-foreground">Encadreurs</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{detailsComplets.tauxPresence}%</p>
                  <p className="text-xs text-muted-foreground">Présence</p>
                </div>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Objectifs pédagogiques */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Objectifs Pédagogiques
            </h3>
            <div className="grid gap-3">
              {detailsComplets.objectifs.map((objectif, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{objectif}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Équipe pédagogique */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Équipe Pédagogique ({detailsComplets.encadreurs.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detailsComplets.encadreurs.map((encadreur, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{encadreur.nom}</p>
                      <p className="text-xs text-muted-foreground">{encadreur.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Fichiers et ressources */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Fichiers et Ressources ({detailsComplets.fichiers.length})
            </h3>
            <div className="space-y-2">
              {detailsComplets.fichiers.map((fichier, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getFileIcon(fichier.type)}</div>
                      <div>
                        <p className="font-medium text-foreground">{fichier.nom}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{fichier.type}</span>
                          <span>•</span>
                          <span>{fichier.taille}</span>
                          <span>•</span>
                          <span>{fichier.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Gérer les Ressources
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
