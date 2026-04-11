"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Award, Ambulance } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const weeklyData = [
  { day: "Lun", registros: 12 },
  { day: "Mar", registros: 19 },
  { day: "Mié", registros: 8 },
  { day: "Jue", registros: 15 },
  { day: "Vie", registros: 22 },
  { day: "Sáb", registros: 10 },
  { day: "Dom", registros: 6 },
]

const totalRegistros = weeklyData.reduce((acc, curr) => acc + curr.registros, 0)

const topParamedico = {
  nombre: "Carlos Andrés Martínez",
  registros: 28,
  ambulancia: "AMB-001",
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen de actividades de la semana
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registros Esta Semana
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRegistros}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% vs semana anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio Diario
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {Math.round(totalRegistros / 7)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registros por día
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mayor Registro
            </CardTitle>
            <Award className="h-5 w-5 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground truncate">
              {topParamedico.nombre}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {topParamedico.registros} registros esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ambulancia Destacada
            </CardTitle>
            <Ambulance className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {topParamedico.ambulancia}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Más activa esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Registros de Accidentes por Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="day"
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-foreground)",
                  }}
                />
                <Bar
                  dataKey="registros"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
