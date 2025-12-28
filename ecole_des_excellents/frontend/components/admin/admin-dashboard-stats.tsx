"use client"

import { Card } from "@/components/ui/card"
import { Users, UserCog, BookOpen, TrendingUp, Award } from "lucide-react"

const stats = [
  {
    title: "Coordons",
    value: "12",
    change: "+2 ce mois",
    trend: "up",
    icon: Award,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Encadreurs",
    value: "45",
    change: "+5 ce mois",
    trend: "up",
    icon: UserCog,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Étudiants",
    value: "324",
    change: "+28 ce mois",
    trend: "up",
    icon: Users,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Cours",
    value: "68",
    change: "+3 ce mois",
    trend: "up",
    icon: BookOpen,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export function AdminDashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className="p-6 hover:shadow-lg transition-shadow duration-200 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2 text-foreground">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
