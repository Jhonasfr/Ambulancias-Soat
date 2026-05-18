"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Award, Ambulance, Users } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import api from "@/app/services/axios"

interface DashboardData {
  total_semana: number
  promedio_diario: number
  por_dia: { day: string; registros: number }[]
  ambulancia_destacada: string
  ambulancia_registros: number
  mayor_registro_nombre: string
  mayor_registro_count: number
  total_empleados: number
  total_ambulancias: number
}

const EMPTY_WEEK = [
  { day: "Lun", registros: 0 },
  { day: "Mar", registros: 0 },
  { day: "Mié", registros: 0 },
  { day: "Jue", registros: 0 },
  { day: "Vie", registros: 0 },
  { day: "Sáb", registros: 0 },
  { day: "Dom", registros: 0 },
]

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("api/dashboard/")
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const weeklyData = data?.por_dia ?? EMPTY_WEEK

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
            <div className="text-3xl font-bold text-foreground">
              {loading ? "—" : (data?.total_semana ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Semana actual</p>
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
              {loading ? "—" : (data?.promedio_diario ?? 0)}
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
              {loading ? "—" : (data?.mayor_registro_nombre || "Sin datos")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {!loading && `${data?.mayor_registro_count ?? 0} registros esta semana`}
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
              {loading ? "—" : (data?.ambulancia_destacada || "Sin datos")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {!loading && `${data?.ambulancia_registros ?? 0} registros esta semana`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 mt-4 md:mt-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empleados Activos
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loading ? "—" : (data?.total_empleados ?? 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ambulancias Activas
            </CardTitle>
            <Ambulance className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loading ? "—" : (data?.total_ambulancias ?? 0)}
            </div>
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
