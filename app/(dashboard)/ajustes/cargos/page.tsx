"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react"

interface Cargo {
  id: number
  nombre: string
  descripcion: string
  salarioBase: string
}

const initialCargos: Cargo[] = [
  {
    id: 1,
    nombre: "Paramédico",
    descripcion: "Profesional encargado de la atención prehospitalaria de emergencias",
    salarioBase: "$2.500.000",
  },
  {
    id: 2,
    nombre: "Conductor de Ambulancia",
    descripcion: "Responsable de la conducción segura del vehículo de emergencia",
    salarioBase: "$1.800.000",
  },
  {
    id: 3,
    nombre: "Médico de Urgencias",
    descripcion: "Médico especialista en atención de emergencias prehospitalarias",
    salarioBase: "$5.000.000",
  },
  {
    id: 4,
    nombre: "Coordinador de Operaciones",
    descripcion: "Encargado de coordinar las operaciones y despacho de ambulancias",
    salarioBase: "$3.500.000",
  },
  {
    id: 5,
    nombre: "Auxiliar Administrativo",
    descripcion: "Apoyo en tareas administrativas y de oficina",
    salarioBase: "$1.500.000",
  },
]

export default function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>(initialCargos)
  const [isOpen, setIsOpen] = useState(false)
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    salarioBase: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (editingCargo) {
      setCargos(
        cargos.map((c) =>
          c.id === editingCargo.id ? { ...c, ...formData } : c
        )
      )
    } else {
      setCargos([
        ...cargos,
        {
          id: Date.now(),
          ...formData,
        },
      ])
    }
    setIsOpen(false)
    setEditingCargo(null)
    setFormData({ nombre: "", descripcion: "", salarioBase: "" })
  }

  const handleEdit = (cargo: Cargo) => {
    setEditingCargo(cargo)
    setFormData({
      nombre: cargo.nombre,
      descripcion: cargo.descripcion,
      salarioBase: cargo.salarioBase,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este cargo?")) {
      setCargos(cargos.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Cargos</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de cargos y posiciones
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingCargo(null)
                setFormData({ nombre: "", descripcion: "", salarioBase: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cargo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingCargo ? "Editar Cargo" : "Nuevo Cargo"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Cargo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ej: Paramédico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Descripción de las funciones del cargo"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salarioBase">Salario Base</Label>
                <Input
                  id="salarioBase"
                  value={formData.salarioBase}
                  onChange={(e) => handleInputChange("salarioBase", e.target.value)}
                  placeholder="Ej: $2.500.000"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {editingCargo ? "Guardar Cambios" : "Crear Cargo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="h-5 w-5 text-primary" />
            Lista de Cargos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden md:table-cell">Descripción</TableHead>
                  <TableHead>Salario Base</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargos.map((cargo) => (
                  <TableRow key={cargo.id}>
                    <TableCell className="font-medium">{cargo.nombre}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {cargo.descripcion}
                    </TableCell>
                    <TableCell>{cargo.salarioBase}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(cargo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cargo.id)}
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
