"use client"

import { useState } from "react"
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

interface Sede {
  id: number
  nombre: string
  direccion: string
  telefono: string
  responsable: string
  activa: boolean
}

const initialSedes: Sede[] = [
  {
    id: 1,
    nombre: "Sede Norte",
    direccion: "Calle 70N #5-100",
    telefono: "(602) 111-1111",
    responsable: "María García",
    activa: true,
  },
  {
    id: 2,
    nombre: "Sede Sur",
    direccion: "Carrera 50 #10-25",
    telefono: "(602) 222-2222",
    responsable: "Pedro Martínez",
    activa: true,
  },
  {
    id: 3,
    nombre: "Sede Este",
    direccion: "Avenida 2E #15-30",
    telefono: "(602) 333-3333",
    responsable: "Ana López",
    activa: true,
  },
  {
    id: 4,
    nombre: "Sede Oeste",
    direccion: "Calle 13 #80-45",
    telefono: "(602) 444-4444",
    responsable: "Carlos Sánchez",
    activa: false,
  },
]

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>(initialSedes)
  const [isOpen, setIsOpen] = useState(false)
  const [editingSede, setEditingSede] = useState<Sede | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    responsable: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (editingSede) {
      setSedes(
        sedes.map((s) =>
          s.id === editingSede.id ? { ...s, ...formData } : s
        )
      )
    } else {
      setSedes([
        ...sedes,
        {
          id: Date.now(),
          ...formData,
          activa: true,
        },
      ])
    }
    setIsOpen(false)
    setEditingSede(null)
    setFormData({ nombre: "", direccion: "", telefono: "", responsable: "" })
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

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar esta sede?")) {
      setSedes(sedes.filter((s) => s.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setSedes(
      sedes.map((s) => (s.id === id ? { ...s, activa: !s.activa } : s))
    )
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
              <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {editingSede ? "Guardar Cambios" : "Crear Sede"}
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
                        onClick={() => toggleStatus(sede.id)}
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
