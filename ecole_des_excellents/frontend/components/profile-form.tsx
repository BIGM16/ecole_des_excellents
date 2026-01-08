"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import fetchWithRefresh from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  promotion?: string;
  photo?: string;
  nom_complet?: string;
  username: string;
}

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchWithRefresh(`${API_BASE}/api/auth/me/`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setPhotoPreview(data.photo || null);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error(e);
        addToast("error", "Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  if (loading) return <div>Chargement...</div>;
  if (!profile) return <div>Profil introuvable</div>;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setPhotoFile(f);
    if (f) setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      const formElements = e.currentTarget.elements;
      form.append(
        "first_name",
        (formElements.namedItem("first_name") as HTMLInputElement).value
      );
      form.append(
        "last_name",
        (formElements.namedItem("last_name") as HTMLInputElement).value
      );
      form.append(
        "email",
        (formElements.namedItem("email") as HTMLInputElement).value
      );
      form.append(
        "promotion",
        (formElements.namedItem("promotion") as HTMLInputElement).value || ""
      );
      if (photoFile) form.append("photo", photoFile);

      const res = await fetchWithRefresh(`${API_BASE}/api/profil/`, {
        method: "PUT",
        body: form,
      });
      if (res.ok) {
        addToast("success", "Profil mis à jour");
        const newProfile = await (
          await fetchWithRefresh(`${API_BASE}/api/auth/me/`)
        ).json();
        setProfile(newProfile);
        setPhotoPreview(newProfile.photo || null);
      } else {
        const err = await res.json().catch(() => ({}));
        addToast("error", err.detail || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      addToast("error", "Erreur réseau lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Mon profil</h2>
      <div className="mb-6 flex gap-6 items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-muted">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="photo"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No photo
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">
            {profile.nom_complet || profile.username}
          </p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-sm text-muted-foreground">
            Promotion: {profile.promotion || "—"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input
              name="first_name"
              defaultValue={profile.first_name || ""}
              className="mt-1 w-full input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              name="last_name"
              defaultValue={profile.last_name || ""}
              className="mt-1 w-full input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            defaultValue={profile.email || ""}
            className="mt-1 w-full input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Promotion</label>
          <input
            name="promotion"
            defaultValue={profile.promotion || ""}
            className="mt-1 w-full input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <div>
          <button disabled={saving} className="btn btn-primary">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
