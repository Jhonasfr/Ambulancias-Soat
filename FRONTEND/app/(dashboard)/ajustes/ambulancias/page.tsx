"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ambulance, Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import api from "@/app/services/axios"

interface AmbulanciaData {
  id: number
  placa: string
  tipo: string
  tipo_display: string
  sede: number | null
  sede_nombre: string
  estado: number
}

interface Sede {
  id: number
  nombre: string
}

const tiposAmbulancia = [
  { value: "BAT", label: "Básica Asistencial Terrestre" },
  { value: "MAT", label: "Medicalizada Asistencial Terrestre" },
  { value: "TAB", label: "Transporte Asistencial Básico" },
  { value: "TAM", label: "Transporte Asistencial Medicalizado" },
]

const estadoColors: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  0: "bg-red-100 text-red-700",
}

export default function AmbulanciasPage() {
  const [ambulancias, setAmbulancias] = useState<AmbulanciaData[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingAmbulancia, setEditingAmbulancia] = useState<AmbulanciaData | null>(null)
  const [formData, setFormData] = useState({
    placa: "",
    tipo: "",
    sede: "",
    estado: "1",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchAmbulancias = async () => {
    try {
      const res = await api.get("api/ambulancias/")
      const data = res.data.results ?? res.data
      setAmbulancias(data.map((a: any) => ({
        id: a.idambulancia,
        placa: a.placa,
        tipo: a.tipo,
        tipo_display: a.tipo_display ?? a.tipo,
        sede: a.sede,
        sede_nombre: a.sede_nombre ?? "",
        estado: a.estado,
      })))
    } catch {
      setAmbulancias([])
    }
  }

  const fetchSedes = async () => {
    try {
      const res = await api.get("api/sedes/")
      const data = res.data.results ?? res.data
      setSedes(data.map((s: any) => ({ id: s.idsede, nombre: s.nombre })))
    } catch {
      setSedes([])
    }
  }

  useEffect(() => {
    fetchAmbulancias()
    fetchSedes()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        placa: formData.placa,
        tipo: formData.tipo,
        sede: formData.sede ? Number(formData.sede) : null,
        estado: Number(formData.estado),
      }
      if (editingAmbulancia) {
        await api.put(`api/ambulancias/${editingAmbulancia.id}/`, payload)
      } else {
        await api.post("api/ambulancias/", payload)
      }
      await fetchAmbulancias()
      setIsOpen(false)
      setEditingAmbulancia(null)
      setFormData({ placa: "", tipo: "", sede: "", estado: "1" })
    } catch {
      alert("Error al guardar la ambulancia")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (ambulancia: AmbulanciaData) => {
    setEditingAmbulancia(ambulancia)
    setFormData({
      placa: ambulancia.placa,
      tipo: ambulancia.tipo,
      sede: ambulancia.sede !== null ? String(ambulancia.sede) : "",
      estado: String(ambulancia.estado),
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de desactivar esta ambulancia?")) return
    try {
      await api.delete(`api/ambulancias/${id}/`)
      await fetchAmbulancias()
    } catch {
      alert("Error al eliminar la ambulancia")
    }
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ambulancias</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de la flota de ambulancias
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingAmbulancia(null)
                setFormData({ placa: "", tipo: "", sede: "", estado: "1" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Ambulancia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingAmbulancia ? "Editar Ambulancia" : "Nueva Ambulancia"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleInputChange("placa", e.target.value)}
                  placeholder="AMB-XXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleInputChange("tipo", value)}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposAmbulancia.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sede">Sede</Label>
                <Select
                  value={formData.sede}
                  onValueChange={(value) => handleInputChange("sede", value)}
                >
                  <SelectTrigger id="sede">
                    <SelectValue placeholder="Seleccionar sede" />
                  </SelectTrigger>
                  <SelectContent>
                    {sedes.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange("estado", value)}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Activa</SelectItem>
                    <SelectItem value="0">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {submitting ? "Guardando..." : editingAmbulancia ? "Guardar Cambios" : "Crear Ambulancia"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {ambulancias.filter((a) => a.estado === 1).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivas</p>
                <p className="text-2xl font-bold text-red-600">
                  {ambulancias.filter((a) => a.estado === 0).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Ambulance className="h-5 w-5 text-primary" />
            Flota de Ambulancias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Sede</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulancias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay ambulancias registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  ambulancias.map((ambulancia) => (
                    <TableRow key={ambulancia.id}>
                      <TableCell className="font-medium">{ambulancia.placa}</TableCell>
                      <TableCell>{ambulancia.tipo_display}</TableCell>
                      <TableCell className="hidden md:table-cell">{ambulancia.sede_nombre || "—"}</TableCell>
                      <TableCell>
                        <Badge className={`${estadoColors[ambulancia.estado]} hover:${estadoColors[ambulancia.estado]}`}>
                          {ambulancia.estado === 1 ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(ambulancia)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ambulancia.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
