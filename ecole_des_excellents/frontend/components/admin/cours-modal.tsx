"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"

interface CoursModalProps {
  isOpen: boolean
  onClose: () => void
  cours?: any
}

export function CoursModal({ isOpen, onClose, cours }: CoursModalProps) {
  const [formData, setFormData] = useState({
    titre: cours?.titre || "",
    code: cours?.code || "",
    niveau: cours?.niveau || "",
    encadreur: cours?.encadreur || "",
    heures: cours?.heures || "",
    description: cours?.description || "",
  })

  const [files, setFiles] = useState<File[]>(cours?.files || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    console.log("Files:", files)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cours ? "Modifier le Cours" : "Ajouter un Cours"}</DialogTitle>
          <DialogDescription>Remplissez les informations du cours</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre du cours</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              placeholder="Anatomie Générale"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code du cours</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="MED-301"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="niveau">Niveau</Label>
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
          <div className="space-y-2">
            <Label htmlFor="encadreur">Encadreur</Label>
            <Select
              value={formData.encadreur}
              onValueChange={(value) => setFormData({ ...formData, encadreur: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un encadreur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pr. Sarah Mbuyi">Pr. Sarah Mbuyi</SelectItem>
                <SelectItem value="Dr. David Kalala">Dr. David Kalala</SelectItem>
                <SelectItem value="Dr. Grace Nsimba">Dr. Grace Nsimba</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heures">Nombre d'heures</Label>
            <Input
              id="heures"
              type="number"
              value={formData.heures}
              onChange={(e) => setFormData({ ...formData, heures: e.target.value })}
              placeholder="60"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du cours..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Documents du cours (PDF, DOCX, etc.)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="files"
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("files")?.click()}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                Ajouter des fichiers
              </Button>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-sm text-muted-foreground">Fichiers ajoutés ({files.length}):</p>
                <div className="space-y-1">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{cours ? "Mettre à jour" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
