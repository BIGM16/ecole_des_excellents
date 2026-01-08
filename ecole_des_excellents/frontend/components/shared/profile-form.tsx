"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Camera, Save, Key, Eye, EyeOff } from "lucide-react"

interface ProfileFormProps {
  role: string
}

export function ProfileForm({ role }: ProfileFormProps) {
  const [profile, setProfile] = useState({
    nom: "Doe",
    prenom: "John",
    email: "john.doe@ede.edu",
    telephone: "+243 900 000 000",
    promotion: "L1 Médecine",
    photoUrl: "/medical-student-profile.png",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = () => {
    // Logique de sauvegarde du profil
    console.log("Profil sauvegardé:", profile)
  }

  const handlePasswordSave = () => {
    // Logique de changement de mot de passe
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }
    console.log("Mot de passe changé")
    setPasswordDialogOpen(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photoUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = () => {
    return `${profile.prenom[0]}${profile.nom[0]}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-muted-foreground mt-2">Gérez vos informations personnelles</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Photo de profil */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Photo de Profil</CardTitle>
            <CardDescription>Cliquez sur l&apos;avatar pour changer votre photo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-40 h-40 border-4 border-primary shadow-xl">
                <AvatarImage src={profile.photoUrl || "/placeholder.svg"} alt={`${profile.prenom} ${profile.nom}`} />
                <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </label>
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-xl text-foreground">
                {profile.prenom} {profile.nom}
              </h3>
              <p className="text-sm text-muted-foreground">{role}</p>
              <p className="text-sm text-primary font-medium mt-1">{profile.promotion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={profile.prenom}
                  onChange={(e) => handleProfileChange("prenom", e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={profile.nom}
                  onChange={(e) => handleProfileChange("nom", e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                placeholder="votre.email@ede.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={profile.telephone}
                onChange={(e) => handleProfileChange("telephone", e.target.value)}
                placeholder="+243 900 000 000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion">Promotion</Label>
              <Input id="promotion" value={profile.promotion} disabled className="bg-muted" />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleProfileSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer les modifications
              </Button>

              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Key className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Changer le mot de passe</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                          placeholder="Entrez votre mot de passe actuel"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          placeholder="Entrez votre nouveau mot de passe"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          placeholder="Confirmez votre nouveau mot de passe"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handlePasswordSave}>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
