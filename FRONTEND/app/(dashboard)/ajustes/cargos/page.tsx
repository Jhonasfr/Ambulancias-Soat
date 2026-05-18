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
} from "@/components/ui/dialog"
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import api from "@/app/services/axios"
import { type Cargo } from "@/app/services/ambulancia"

export default function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null)
  const [nombre, setNombre] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchCargos = async () => {
    setLoading(true)
    try {
      const res = await api.get("user/Cargo/")
      setCargos(res.data.results ?? res.data)
    } catch {
      setCargos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCargos() }, [])

  const openCreate = () => {
    setEditingCargo(null)
    setNombre("")
    setIsOpen(true)
  }

  const openEdit = (cargo: Cargo) => {
    setEditingCargo(cargo)
    setNombre(cargo.nombrecargo)
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!nombre.trim()) return
    setSubmitting(true)
    try {
      if (editingCargo) {
        await api.put("user/Cargo/", { idcargo: editingCargo.idcargo, nombrecargo: nombre.trim() })
      } else {
        await api.post("user/Cargo/", { nombrecargo: nombre.trim() })
      }
      setIsOpen(false)
      fetchCargos()
    } catch (err: any) {
      alert(err?.response?.data?.error ?? "Error al guardar el cargo")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (cargo: Cargo) => {
    if (!confirm(`¿Desactivar el cargo "${cargo.nombrecargo}"?`)) return
    try {
      await api.delete("user/Cargo/", { data: { idcargo: cargo.idcargo } })
      fetchCargos()
    } catch (err: any) {
      alert(err?.response?.data?.error ?? "Error al desactivar el cargo")
    }
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Cargos</h1>
          <p className="text-muted-foreground mt-1">Gestión de cargos del personal</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cargo
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingCargo ? "Editar Cargo" : "Nuevo Cargo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nombrecargo">Nombre del Cargo *</Label>
              <Input
                id="nombrecargo"
                placeholder="Ej: Paramédico, Conductor..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !nombre.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Guardando..." : editingCargo ? "Guardar Cambios" : "Crear Cargo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="h-5 w-5 text-primary" />
            Lista de Cargos
            {cargos.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">({cargos.length})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nombre del Cargo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : cargos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay cargos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  cargos.map((cargo) => (
                    <TableRow key={cargo.idcargo}>
                      <TableCell className="text-muted-foreground">{cargo.idcargo}</TableCell>
                      <TableCell className="font-medium">{cargo.nombrecargo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={cargo.estadocargo === 1 ? "default" : "secondary"}
                          className={cargo.estadocargo === 1 ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        >
                          {cargo.estadocargo === 1 ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(cargo)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cargo)}
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

