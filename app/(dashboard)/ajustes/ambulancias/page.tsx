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
import { Ambulance, Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AmbulanciaData {
  id: number
  placa: string
  tipo: string
  marca: string
  modelo: string
  anio: string
  sede: string
  estado: string
}

const initialAmbulancias: AmbulanciaData[] = [
  {
    id: 1,
    placa: "AMB-001",
    tipo: "Medicalizada",
    marca: "Mercedes-Benz",
    modelo: "Sprinter",
    anio: "2022",
    sede: "Sede Norte",
    estado: "activa",
  },
  {
    id: 2,
    placa: "AMB-002",
    tipo: "UCI Móvil",
    marca: "Ford",
    modelo: "Transit",
    anio: "2023",
    sede: "Sede Sur",
    estado: "activa",
  },
  {
    id: 3,
    placa: "AMB-003",
    tipo: "Básica",
    marca: "Chevrolet",
    modelo: "N300",
    anio: "2021",
    sede: "Sede Este",
    estado: "activa",
  },
  {
    id: 4,
    placa: "AMB-004",
    tipo: "Medicalizada",
    marca: "Mercedes-Benz",
    modelo: "Sprinter",
    anio: "2020",
    sede: "Sede Oeste",
    estado: "mantenimiento",
  },
  {
    id: 5,
    placa: "AMB-005",
    tipo: "Básica",
    marca: "Renault",
    modelo: "Master",
    anio: "2019",
    sede: "Sede Norte",
    estado: "inactiva",
  },
]

const tiposAmbulancia = ["Básica", "Medicalizada", "UCI Móvil"]
const sedes = ["Sede Norte", "Sede Sur", "Sede Este", "Sede Oeste", "Sede Central"]
const estados = [
  { value: "activa", label: "Activa" },
  { value: "mantenimiento", label: "En Mantenimiento" },
  { value: "inactiva", label: "Inactiva" },
]

const estadoColors: Record<string, string> = {
  activa: "bg-green-100 text-green-700",
  mantenimiento: "bg-yellow-100 text-yellow-700",
  inactiva: "bg-red-100 text-red-700",
}

export default function AmbulanciasPage() {
  const [ambulancias, setAmbulancias] = useState<AmbulanciaData[]>(initialAmbulancias)
  const [isOpen, setIsOpen] = useState(false)
  const [editingAmbulancia, setEditingAmbulancia] = useState<AmbulanciaData | null>(null)
  const [formData, setFormData] = useState({
    placa: "",
    tipo: "",
    marca: "",
    modelo: "",
    anio: "",
    sede: "",
    estado: "activa",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (editingAmbulancia) {
      setAmbulancias(
        ambulancias.map((a) =>
          a.id === editingAmbulancia.id ? { ...a, ...formData } : a
        )
      )
    } else {
      setAmbulancias([
        ...ambulancias,
        {
          id: Date.now(),
          ...formData,
        },
      ])
    }
    setIsOpen(false)
    setEditingAmbulancia(null)
    setFormData({ placa: "", tipo: "", marca: "", modelo: "", anio: "", sede: "", estado: "activa" })
  }

  const handleEdit = (ambulancia: AmbulanciaData) => {
    setEditingAmbulancia(ambulancia)
    setFormData({
      placa: ambulancia.placa,
      tipo: ambulancia.tipo,
      marca: ambulancia.marca,
      modelo: ambulancia.modelo,
      anio: ambulancia.anio,
      sede: ambulancia.sede,
      estado: ambulancia.estado,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar esta ambulancia?")) {
      setAmbulancias(ambulancias.filter((a) => a.id !== id))
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
                setFormData({ placa: "", tipo: "", marca: "", modelo: "", anio: "", sede: "", estado: "activa" })
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
              <div className="grid grid-cols-2 gap-4">
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
                      {tiposAmbulancia.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => handleInputChange("marca", e.target.value)}
                    placeholder="Ej: Mercedes-Benz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(e) => handleInputChange("modelo", e.target.value)}
                    placeholder="Ej: Sprinter"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio"
                    value={formData.anio}
                    onChange={(e) => handleInputChange("anio", e.target.value)}
                    placeholder="Ej: 2023"
                  />
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
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange("estado", value)}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {editingAmbulancia ? "Guardar Cambios" : "Crear Ambulancia"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {ambulancias.filter((a) => a.estado === "activa").length}
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
                <p className="text-sm text-muted-foreground">En Mantenimiento</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ambulancias.filter((a) => a.estado === "mantenimiento").length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Ambulance className="h-5 w-5 text-yellow-600" />
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
                  {ambulancias.filter((a) => a.estado === "inactiva").length}
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
                  <TableHead className="hidden md:table-cell">Marca/Modelo</TableHead>
                  <TableHead className="hidden lg:table-cell">Año</TableHead>
                  <TableHead className="hidden lg:table-cell">Sede</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulancias.map((ambulancia) => (
                  <TableRow key={ambulancia.id}>
                    <TableCell className="font-medium">{ambulancia.placa}</TableCell>
                    <TableCell>{ambulancia.tipo}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {ambulancia.marca} {ambulancia.modelo}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{ambulancia.anio}</TableCell>
                    <TableCell className="hidden lg:table-cell">{ambulancia.sede}</TableCell>
                    <TableCell>
                      <Badge className={`${estadoColors[ambulancia.estado]} hover:${estadoColors[ambulancia.estado]}`}>
                        {estados.find((e) => e.value === ambulancia.estado)?.label}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
