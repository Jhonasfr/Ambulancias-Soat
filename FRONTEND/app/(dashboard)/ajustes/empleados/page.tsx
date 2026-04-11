"use client"

import { useState } from "react"
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
import { Users, Plus, Pencil, Trash2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Empleado {
  id: number
  nombre: string
  documento: string
  cargo: string
  sede: string
  telefono: string
  email: string
  activo: boolean
}

const initialEmpleados: Empleado[] = [
  {
    id: 1,
    nombre: "Carlos Andrés Martínez",
    documento: "1234567890",
    cargo: "Paramédico",
    sede: "Sede Norte",
    telefono: "3001234567",
    email: "carlos.martinez@ambulanciascali.com",
    activo: true,
  },
  {
    id: 2,
    nombre: "María Fernanda López",
    documento: "9876543210",
    cargo: "Conductor de Ambulancia",
    sede: "Sede Norte",
    telefono: "3109876543",
    email: "maria.lopez@ambulanciascali.com",
    activo: true,
  },
  {
    id: 3,
    nombre: "Pedro José Sánchez",
    documento: "5678901234",
    cargo: "Paramédico",
    sede: "Sede Sur",
    telefono: "3205678901",
    email: "pedro.sanchez@ambulanciascali.com",
    activo: true,
  },
  {
    id: 4,
    nombre: "Laura Gómez Rodríguez",
    documento: "4567890123",
    cargo: "Médico de Urgencias",
    sede: "Sede Sur",
    telefono: "3154567890",
    email: "laura.gomez@ambulanciascali.com",
    activo: true,
  },
  {
    id: 5,
    nombre: "Juan David Pérez",
    documento: "3456789012",
    cargo: "Coordinador de Operaciones",
    sede: "Sede Central",
    telefono: "3003456789",
    email: "juan.perez@ambulanciascali.com",
    activo: false,
  },
]

const cargos = [
  "Paramédico",
  "Conductor de Ambulancia",
  "Médico de Urgencias",
  "Coordinador de Operaciones",
  "Auxiliar Administrativo",
]

const sedes = ["Sede Norte", "Sede Sur", "Sede Este", "Sede Oeste", "Sede Central"]

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>(initialEmpleados)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    cargo: "",
    sede: "",
    telefono: "",
    email: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (editingEmpleado) {
      setEmpleados(
        empleados.map((e) =>
          e.id === editingEmpleado.id ? { ...e, ...formData } : e
        )
      )
    } else {
      setEmpleados([
        ...empleados,
        {
          id: Date.now(),
          ...formData,
          activo: true,
        },
      ])
    }
    setIsOpen(false)
    setEditingEmpleado(null)
    setFormData({ nombre: "", documento: "", cargo: "", sede: "", telefono: "", email: "" })
  }

  const handleEdit = (empleado: Empleado) => {
    setEditingEmpleado(empleado)
    setFormData({
      nombre: empleado.nombre,
      documento: empleado.documento,
      cargo: empleado.cargo,
      sede: empleado.sede,
      telefono: empleado.telefono,
      email: empleado.email,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este empleado?")) {
      setEmpleados(empleados.filter((e) => e.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setEmpleados(
      empleados.map((e) => (e.id === id ? { ...e, activo: !e.activo } : e))
    )
  }

  const filteredEmpleados = empleados.filter(
    (e) =>
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.documento.includes(searchTerm) ||
      e.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Empleados</h1>
          <p className="text-muted-foreground mt-1">
            Gestión del personal
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setEditingEmpleado(null)
                setFormData({ nombre: "", documento: "", cargo: "", sede: "", telefono: "", email: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Nombres y apellidos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">Documento</Label>
                <Input
                  id="documento"
                  value={formData.documento}
                  onChange={(e) => handleInputChange("documento", e.target.value)}
                  placeholder="Número de documento"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select
                    value={formData.cargo}
                    onValueChange={(value) => handleInputChange("cargo", value)}
                  >
                    <SelectTrigger id="cargo">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos.map((cargo) => (
                        <SelectItem key={cargo} value={cargo}>
                          {cargo}
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
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem key={sede} value={sede}>
                          {sede}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="Número de contacto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {editingEmpleado ? "Guardar Cambios" : "Crear Empleado"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Lista de Empleados
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, documento o cargo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead className="hidden md:table-cell">Documento</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden lg:table-cell">Sede</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(empleado.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{empleado.nombre}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {empleado.documento}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{empleado.documento}</TableCell>
                    <TableCell>{empleado.cargo}</TableCell>
                    <TableCell className="hidden lg:table-cell">{empleado.sede}</TableCell>
                    <TableCell>
                      <Badge
                        variant={empleado.activo ? "default" : "secondary"}
                        className={empleado.activo ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        onClick={() => toggleStatus(empleado.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {empleado.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(empleado)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(empleado.id)}
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
