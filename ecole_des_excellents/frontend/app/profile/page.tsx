"use client";

import React from "react";
import ProfileForm from "@/components/profile-form";
import { ToastContainer } from "@/components/toast-container";

export default function ProfilePage() {
  return (
    <div className="p-8">
      <ProfileForm />
      <ToastContainer />
    </div>
  );
}
