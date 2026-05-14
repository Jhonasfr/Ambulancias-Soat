"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import api from "@/app/services/axios"

interface Sede {
  id: number
  nombre: string
  direccion: string
  telefono: string
  responsable: string
  activa: boolean
}

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingSede, setEditingSede] = useState<Sede | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    responsable: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchSedes = async () => {
    try {
      const res = await api.get("api/sedes/")
      const data = res.data.results ?? res.data
      setSedes(data.map((s: any) => ({
        id: s.idsede,
        nombre: s.nombre,
        direccion: s.direccion ?? "",
        telefono: s.telefono ?? "",
        responsable: s.responsable ?? "",
        activa: s.activa,
      })))
    } catch {
      setSedes([])
    }
  }

  useEffect(() => { fetchSedes() }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (editingSede) {
        await api.put(`api/sedes/${editingSede.id}/`, formData)
      } else {
        await api.post("api/sedes/", formData)
      }
      await fetchSedes()
      setIsOpen(false)
      setEditingSede(null)
      setFormData({ nombre: "", direccion: "", telefono: "", responsable: "" })
    } catch {
      alert("Error al guardar la sede")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (sede: Sede) => {
    setEditingSede(sede)
    setFormData({
      nombre: sede.nombre,
      direccion: sede.direccion,
      telefono: sede.telefono,
      responsable: sede.responsable,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta sede?")) return
    try {
      await api.delete(`api/sedes/${id}/`)
      await fetchSedes()
    } catch {
      alert("Error al eliminar la sede")
    }
  }

  const toggleStatus = async (sede: Sede) => {
    try {
      await api.put(`api/sedes/${sede.id}/`, { activa: !sede.activa })
      await fetchSedes()
    } catch {
      alert("Error al cambiar el estado")
    }
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sedes</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de sedes y ubicaciones
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingSede(null)
                setFormData({ nombre: "", direccion: "", telefono: "", responsable: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sede
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingSede ? "Editar Sede" : "Nueva Sede"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ej: Sede Central"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  placeholder="Ej: Calle 10 #5-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="Ej: (602) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => handleInputChange("responsable", e.target.value)}
                  placeholder="Nombre del responsable"
                />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {submitting ? "Guardando..." : editingSede ? "Guardar Cambios" : "Crear Sede"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            Lista de Sedes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Dirección</TableHead>
                  <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden lg:table-cell">Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sedes.map((sede) => (
                  <TableRow key={sede.id}>
                    <TableCell className="font-medium">{sede.nombre}</TableCell>
                    <TableCell className="hidden md:table-cell">{sede.direccion}</TableCell>
                    <TableCell className="hidden lg:table-cell">{sede.telefono}</TableCell>
                    <TableCell className="hidden lg:table-cell">{sede.responsable}</TableCell>
                    <TableCell>
                      <Badge
                        variant={sede.activa ? "default" : "secondary"}
                        className={sede.activa ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        onClick={() => toggleStatus(sede)}
                        style={{ cursor: "pointer" }}
                      >
                        {sede.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(sede)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sede.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
