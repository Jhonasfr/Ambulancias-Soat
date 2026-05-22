"use client"

import { useState, useEffect } from "react"
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
import { Users, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  getEmpleados,
  toggleEstadoEmpleado,
  getCargos,
  getNiveles,
  getRegionales,
  crearEmpleado,
  getSedes,
  getAmbulancias,
  type Empleado,
  type Cargo,
  type Nivel,
  type Regional,
  type Sede,
  type Ambulancia,
} from "@/app/services/ambulancia"

const PAGE_SIZE = 10

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [cargos, setCargos] = useState<Cargo[]>([])
  const [niveles, setNiveles] = useState<Nivel[]>([])
  const [regionales, setRegionales] = useState<Regional[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([])

  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
    cc_colaborador: "",
    tipo_documento: "CC",
    nombre_colaborador: "",
    apellido_colaborador: "",
    correo_colaborador: "",
    telefo_colaborador: "",
    direccion: "",
    cargo_colaborador: "",
    nivel_colaborador: "",
    regional_colab: "",
    sede_id: "",
    ambulancia_id: "",
    numero_licencia: "",
    especialidad: "",
    tipo_sangre: "",
    contacto_emergencia: "",
  })

  const fetchEmpleados = async (search = searchTerm, pg = page) => {
    setLoading(true)
    try {
      const data = await getEmpleados(pg, PAGE_SIZE, search)
      setEmpleados(data.results ?? [])
      setTotal(data.count ?? 0)
    } catch {
      setEmpleados([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOpciones = async () => {
    try {
      const [c, n, r, s, a] = await Promise.all([getCargos(), getNiveles(), getRegionales(), getSedes(), getAmbulancias()])
      setCargos(c)
      setNiveles(n)
      setRegionales(r)
      setSedes(s)
      setAmbulancias(a)
    } catch {}
  }

  useEffect(() => {
    fetchOpciones()
  }, [])

  useEffect(() => {
    fetchEmpleados(searchTerm, page)
  }, [page, searchTerm])

  const handleSearch = () => {
    setPage(1)
    setSearchTerm(searchInput)
  }

  const handleToggleStatus = async (emp: Empleado) => {
    const nuevoEstado = emp.estado_colaborador === 1 ? 0 : 1
    try {
      await toggleEstadoEmpleado(emp.id_colaborador, nuevoEstado as 0 | 1)
      await fetchEmpleados()
    } catch {
      alert("Error al cambiar el estado del empleado")
    }
  }

  const handleSubmit = async () => {
    if (!formData.usuario || !formData.password || !formData.cc_colaborador ||
      !formData.nombre_colaborador || !formData.apellido_colaborador ||
      !formData.correo_colaborador || !formData.cargo_colaborador ||
      !formData.nivel_colaborador || !formData.regional_colab) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }
    setSubmitting(true)
    try {
      await crearEmpleado({
        usuario: formData.usuario,
        password: formData.password,
        idcolaborador: {
          cc_colaborador: formData.cc_colaborador,
          tipo_documento: formData.tipo_documento,
          nombre_colaborador: formData.nombre_colaborador,
          apellido_colaborador: formData.apellido_colaborador,
          correo_colaborador: formData.correo_colaborador,
          telefo_colaborador: formData.telefo_colaborador,
          direccion: formData.direccion,
          cargo_colaborador: Number(formData.cargo_colaborador),
          nivel_colaborador: Number(formData.nivel_colaborador),
          regional_colab: Number(formData.regional_colab),
          sede_id: formData.sede_id ? Number(formData.sede_id) : null,
          ambulancia_id: formData.ambulancia_id && formData.ambulancia_id !== "none" ? Number(formData.ambulancia_id) : null,
          numero_licencia: formData.numero_licencia,
          especialidad: formData.especialidad,
          tipo_sangre: formData.tipo_sangre,
          contacto_emergencia: formData.contacto_emergencia,
        },
      })
      alert("Empleado creado correctamente")
      setIsOpen(false)
      setFormData({
        usuario: "", password: "", cc_colaborador: "", tipo_documento: "CC",
        nombre_colaborador: "", apellido_colaborador: "", correo_colaborador: "",
        telefo_colaborador: "", direccion: "", cargo_colaborador: "",
        nivel_colaborador: "", regional_colab: "", sede_id: "", ambulancia_id: "",
        numero_licencia: "", especialidad: "", tipo_sangre: "", contacto_emergencia: "",
      })
      setPage(1)
      fetchEmpleados(searchTerm, 1)
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.detail || "Error al crear el empleado"
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (nombre: string, apellido: string) =>
    `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase()

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Empleados</h1>
          <p className="text-muted-foreground mt-1">Gestión del personal</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Nuevo Empleado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuario *</Label>
                  <Input id="usuario" placeholder="Nombre de usuario" value={formData.usuario}
                    onChange={(e) => setFormData(p => ({ ...p, usuario: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password}
                    onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc_colaborador">Cédula *</Label>
                <div className="flex gap-2">
                  <Select value={formData.tipo_documento}
                    onValueChange={(v) => setFormData(p => ({ ...p, tipo_documento: v }))}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">CC</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="cc_colaborador" placeholder="Número de documento" className="flex-1"
                    value={formData.cc_colaborador}
                    onChange={(e) => setFormData(p => ({ ...p, cc_colaborador: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_colaborador">Nombre *</Label>
                  <Input id="nombre_colaborador" placeholder="Nombre" value={formData.nombre_colaborador}
                    onChange={(e) => setFormData(p => ({ ...p, nombre_colaborador: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido_colaborador">Apellido *</Label>
                  <Input id="apellido_colaborador" placeholder="Apellido" value={formData.apellido_colaborador}
                    onChange={(e) => setFormData(p => ({ ...p, apellido_colaborador: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo_colaborador">Correo *</Label>
                <Input id="correo_colaborador" type="email" placeholder="correo@ejemplo.com" value={formData.correo_colaborador}
                  onChange={(e) => setFormData(p => ({ ...p, correo_colaborador: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefo_colaborador">Teléfono</Label>
                <Input id="telefo_colaborador" placeholder="Número de teléfono" value={formData.telefo_colaborador}
                  onChange={(e) => setFormData(p => ({ ...p, telefo_colaborador: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Dirección de residencia" value={formData.direccion}
                  onChange={(e) => setFormData(p => ({ ...p, direccion: e.target.value }))} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Select value={formData.cargo_colaborador}
                    onValueChange={(v) => setFormData(p => ({ ...p, cargo_colaborador: v }))}>
                    <SelectTrigger><SelectValue placeholder="Cargo" /></SelectTrigger>
                    <SelectContent>
                      {cargos.map((c) => (
                        <SelectItem key={c.idcargo} value={String(c.idcargo)}>{c.nombrecargo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nivel *</Label>
                  <Select value={formData.nivel_colaborador}
                    onValueChange={(v) => setFormData(p => ({ ...p, nivel_colaborador: v }))}>
                    <SelectTrigger><SelectValue placeholder="Nivel" /></SelectTrigger>
                    <SelectContent>
                      {niveles.map((n) => (
                        <SelectItem key={n.idnivel} value={String(n.idnivel)}>{n.nombrenivel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Regional *</Label>
                  <Select value={formData.regional_colab}
                    onValueChange={(v) => setFormData(p => ({ ...p, regional_colab: v }))}>
                    <SelectTrigger><SelectValue placeholder="Regional" /></SelectTrigger>
                    <SelectContent>
                      {regionales.map((r) => (
                        <SelectItem key={r.idregional} value={String(r.idregional)}>{r.nombreregional}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Información Laboral */}
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sede</Label>
                  <Select value={formData.sede_id}
                    onValueChange={(v) => setFormData(p => ({ ...p, sede_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Sede" /></SelectTrigger>
                    <SelectContent>
                      {sedes.map((s) => (
                        <SelectItem key={s.idsede} value={String(s.idsede)}>{s.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero_licencia">Número de Licencia</Label>
                  <Input id="numero_licencia" placeholder="N° de licencia" value={formData.numero_licencia}
                    onChange={(e) => setFormData(p => ({ ...p, numero_licencia: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ambulancia asignada</Label>
                <Select value={formData.ambulancia_id}
                  onValueChange={(v) => setFormData(p => ({ ...p, ambulancia_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sin ambulancia asignada" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin ambulancia</SelectItem>
                    {ambulancias.map((a) => (
                      <SelectItem key={a.idambulancia} value={String(a.idambulancia)}>
                        {a.placa} — {a.tipo_display}{a.sede_nombre ? ` (${a.sede_nombre})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input id="especialidad" placeholder="Ej: Atención Prehospitalaria" value={formData.especialidad}
                  onChange={(e) => setFormData(p => ({ ...p, especialidad: e.target.value }))} />
              </div>
              {/* Información de Emergencia */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Sangre (RH)</Label>
                  <Select value={formData.tipo_sangre}
                    onValueChange={(v) => setFormData(p => ({ ...p, tipo_sangre: v }))}>
                    <SelectTrigger><SelectValue placeholder="Tipo de sangre" /></SelectTrigger>
                    <SelectContent>
                      {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((rh) => (
                        <SelectItem key={rh} value={rh}>{rh}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contacto_emergencia">Contacto de Emergencia</Label>
                  <Input id="contacto_emergencia" placeholder="Nombre - Teléfono" value={formData.contacto_emergencia}
                    onChange={(e) => setFormData(p => ({ ...p, contacto_emergencia: e.target.value }))} />
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {submitting ? "Creando..." : "Crear Empleado"}
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
              {total > 0 && <span className="text-sm font-normal text-muted-foreground">({total})</span>}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, cédula..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="outline" onClick={handleSearch}>Buscar</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead className="hidden md:table-cell">Cédula</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : empleados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No se encontraron empleados
                    </TableCell>
                  </TableRow>
                ) : (
                  empleados.map((emp) => (
                    <TableRow key={emp.id_colaborador}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(emp.nombre_colaborador, emp.apellido_colaborador)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{emp.nombre_colaborador} {emp.apellido_colaborador}</p>
                            <p className="text-xs text-muted-foreground">{emp.correo_colaborador}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{emp.cc_colaborador}</TableCell>
                      <TableCell>{emp.nombre_cargo ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={emp.estado_colaborador === 1 ? "default" : "secondary"}
                          className={emp.estado_colaborador === 1 ? "bg-green-100 text-green-700 hover:bg-green-100 cursor-pointer" : "cursor-pointer"}
                          onClick={() => handleToggleStatus(emp)}
                        >
                          {emp.estado_colaborador === 1 ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



