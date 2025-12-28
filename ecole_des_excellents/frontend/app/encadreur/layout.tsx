"use client"

import type React from "react"
import { useState } from "react"
import { EncadreurSidebar } from "@/components/encadreur/encadreur-sidebar"
import { EncadreurHeader } from "@/components/encadreur/encadreur-header"

export default function EncadreurLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <EncadreurSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <EncadreurHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
