"use client"

import { Card } from "@/components/ui/card"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const enrollmentData = [
  { month: "Jan", etudiants: 245, cours: 58 },
  { month: "Fév", etudiants: 262, cours: 62 },
  { month: "Mar", etudiants: 278, cours: 64 },
  { month: "Avr", etudiants: 289, cours: 65 },
  { month: "Mai", etudiants: 302, cours: 67 },
  { month: "Juin", etudiants: 324, cours: 68 },
]

const performanceData = [
  { category: "Excellent", count: 145 },
  { category: "Très Bien", count: 98 },
  { category: "Bien", count: 56 },
  { category: "Assez Bien", count: 25 },
]

export function AdminCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Évolution des inscriptions */}
      <Card className="p-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
        <h3 className="text-lg font-semibold text-foreground mb-4">Évolution des Inscriptions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
            <XAxis dataKey="month" stroke="oklch(0.65 0 0)" />
            <YAxis stroke="oklch(0.65 0 0)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.15 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="etudiants" stroke="oklch(0.7 0.18 85)" strokeWidth={2} name="Étudiants" />
            <Line type="monotone" dataKey="cours" stroke="oklch(0.6 0.15 85)" strokeWidth={2} name="Cours" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Performance des étudiants */}
      <Card className="p-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribution des Performances</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
            <XAxis dataKey="category" stroke="oklch(0.65 0 0)" />
            <YAxis stroke="oklch(0.65 0 0)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.15 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="oklch(0.7 0.18 85)" name="Nombre d'étudiants" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
