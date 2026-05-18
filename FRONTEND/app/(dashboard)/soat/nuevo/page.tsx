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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ambulance, User, AlertTriangle, Building2, Download, Save, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import api from "@/app/services/axios"

interface AmbulanciaItem {
  id: number
  placa: string
  tipo: string
  tipo_display: string
  sede_id: number | null
  sede_nombre: string
}

interface EmpleadoItem {
  id: number
  nombre: string
  apellido: string
  cargo: string
  nombre_sede: string
  ambulancia_id: number | null
}

export default function NuevoSOATPage() {
  const [activeTab, setActiveTab] = useState("ambulancia")
  const [ambulancias, setAmbulancias] = useState<AmbulanciaItem[]>([])
  const [empleados, setEmpleados] = useState<EmpleadoItem[]>([])
  const [ambulanciaId, setAmbulanciaId] = useState<string>("")
  const [tripulantesFiltrados, setTripulantesFiltrados] = useState<EmpleadoItem[]>([])
  const [formData, setFormData] = useState({
    // Ambulancia
    placaAmbulancia: "",
    tipoAmbulancia: "",
    tripulante1: "",
    tripulante2: "",
    sede: "",
    // Paciente
    nombrePaciente: "",
    documentoPaciente: "",
    tipoDocumento: "",
    edadPaciente: "",
    generoPaciente: "",
    direccionPaciente: "",
    telefonoPaciente: "",
    // Siniestro
    fechaSiniestro: "",
    horaSiniestro: "",
    lugarSiniestro: "",
    tipoVehiculo: "",
    placaVehiculo: "",
    poliza: "",
    aseguradora: "",
    descripcionSiniestro: "",
    // IPS
    departamento: "",
    ciudad: "",
    sedePrestadora: "",
  })

  useEffect(() => {
    api.get("api/ambulancias/").then(res => {
      const data = res.data.results ?? res.data
      setAmbulancias(data.map((a: any) => ({
        id: a.idambulancia,
        placa: a.placa,
        tipo: a.tipo,
        tipo_display: a.tipo_display ?? a.tipo,
        sede_id: a.sede,
        sede_nombre: a.sede_nombre ?? "",
      })))
    }).catch(() => {})

    api.get("user/lista-usuarios/", { params: { page: 1, page_size: 500 } }).then(res => {
      const data = res.data.results ?? res.data
      setEmpleados(data.map((e: any) => ({
        id: e.id_colaborador,
        nombre: e.nombre_colaborador,
        apellido: e.apellido_colaborador,
        cargo: e.nombre_cargo ?? "",
        nombre_sede: e.nombre_sede ?? "",
        ambulancia_id: e.ambulancia_id ?? null,
      })))
    }).catch(() => {})
  }, [])

  const handleAmbulanciaSelect = (id: string) => {
    setAmbulanciaId(id)
    const amb = ambulancias.find(a => String(a.id) === id)
    if (amb) {
      setFormData(prev => ({
        ...prev,
        placaAmbulancia: amb.placa,
        tipoAmbulancia: amb.tipo_display,
        sede: amb.sede_nombre,
      }))
      // Primero filtra por ambulancia asignada
      const porAmbulancia = empleados.filter(e => e.ambulancia_id === amb.id)
      // Si no hay asignados, muestra todos los de la misma sede como fallback
      if (porAmbulancia.length > 0) {
        setTripulantesFiltrados(porAmbulancia)
      } else {
        setTripulantesFiltrados(empleados.filter(e => e.nombre_sede === amb.sede_nombre))
      }
    } else {
      setTripulantesFiltrados([])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExportTXT = () => {
    const content = `
REGISTRO SOAT - Sistema de Ambulancias Cali
==========================================

DATOS DE AMBULANCIA
-------------------
Placa: ${formData.placaAmbulancia}
Tipo: ${formData.tipoAmbulancia}
Tripulante 1: ${formData.tripulante1}
Tripulante 2: ${formData.tripulante2}
Sede: ${formData.sede}

DATOS DEL PACIENTE
------------------
Nombre: ${formData.nombrePaciente}
Documento: ${formData.tipoDocumento} ${formData.documentoPaciente}
Edad: ${formData.edadPaciente}
Género: ${formData.generoPaciente}
Dirección: ${formData.direccionPaciente}
Teléfono: ${formData.telefonoPaciente}

DATOS DEL SINIESTRO
-------------------
Fecha: ${formData.fechaSiniestro}
Hora: ${formData.horaSiniestro}
Lugar: ${formData.lugarSiniestro}
Tipo de Vehículo: ${formData.tipoVehiculo}
Placa Vehículo: ${formData.placaVehiculo}
Póliza: ${formData.poliza}
Aseguradora: ${formData.aseguradora}
Descripción: ${formData.descripcionSiniestro}

DATOS IPS
---------
Departamento: ${formData.departamento}
Ciudad: ${formData.ciudad}
Sede Prestadora: ${formData.sedePrestadora}

==========================================
Generado: ${new Date().toLocaleString("es-CO")}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SOAT_${formData.documentoPaciente || "registro"}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    try {
      const payload = {
        ambulancia: ambulanciaId ? Number(ambulanciaId) : null,
        placa_ambulancia: formData.placaAmbulancia,
        tipo_ambulancia: formData.tipoAmbulancia,
        tripulante1: formData.tripulante1,
        tripulante2: formData.tripulante2,
        nombre_paciente: formData.nombrePaciente,
        documento_paciente: formData.documentoPaciente,
        tipo_documento: formData.tipoDocumento,
        edad_paciente: formData.edadPaciente,
        genero_paciente: formData.generoPaciente,
        direccion_paciente: formData.direccionPaciente,
        telefono_paciente: formData.telefonoPaciente,
        fecha_siniestro: formData.fechaSiniestro || null,
        hora_siniestro: formData.horaSiniestro || null,
        lugar_siniestro: formData.lugarSiniestro,
        tipo_vehiculo: formData.tipoVehiculo,
        placa_vehiculo: formData.placaVehiculo,
        poliza: formData.poliza,
        aseguradora: formData.aseguradora,
        descripcion_siniestro: formData.descripcionSiniestro,
        departamento: formData.departamento,
        ciudad: formData.ciudad,
        sede_prestadora: formData.sedePrestadora,
      }
      await api.post("api/soat/", payload)
      alert("Registro guardado exitosamente")
    } catch {
      alert("Error al guardar el registro SOAT")
    }
  }

  const validateForm = (): boolean => {
    const requiredFields = [
      { value: ambulanciaId, name: "Ambulancia" },
      { value: formData.tripulante1, name: "Tripulante 1" },
      { value: formData.tripulante2, name: "Tripulante 2" },
      { value: formData.nombrePaciente, name: "Nombre del Paciente" },
      { value: formData.tipoDocumento, name: "Tipo de Documento" },
      { value: formData.documentoPaciente, name: "Número de Documento" },
      { value: formData.edadPaciente, name: "Edad del Paciente" },
      { value: formData.generoPaciente, name: "Género del Paciente" },
      { value: formData.direccionPaciente, name: "Dirección del Paciente" },
      { value: formData.telefonoPaciente, name: "Teléfono del Paciente" },
      { value: formData.fechaSiniestro, name: "Fecha del Siniestro" },
      { value: formData.horaSiniestro, name: "Hora del Siniestro" },
      { value: formData.lugarSiniestro, name: "Lugar del Siniestro" },
      { value: formData.tipoVehiculo, name: "Tipo de Vehículo" },
      { value: formData.placaVehiculo, name: "Placa del Vehículo" },
      { value: formData.poliza, name: "Número de Póliza" },
      { value: formData.aseguradora, name: "Aseguradora" },
      { value: formData.departamento, name: "Departamento" },
      { value: formData.ciudad, name: "Ciudad" },
      { value: formData.sedePrestadora, name: "Sede Prestadora" },
    ]

    const emptyFields = requiredFields.filter(field => !field.value)
    
    if (emptyFields.length > 0) {
      alert(`Por favor complete los siguientes campos obligatorios:\n\n${emptyFields.map(f => `• ${f.name}`).join("\n")}`)
      return false
    }
    
    return true
  }

  const handleSaveAndExport = async () => {
    if (!validateForm()) return
    
    try {
      const payload = {
        ambulancia: ambulanciaId ? Number(ambulanciaId) : null,
        placa_ambulancia: formData.placaAmbulancia,
        tipo_ambulancia: formData.tipoAmbulancia,
        tripulante1: formData.tripulante1,
        tripulante2: formData.tripulante2,
        nombre_paciente: formData.nombrePaciente,
        documento_paciente: formData.documentoPaciente,
        tipo_documento: formData.tipoDocumento,
        edad_paciente: formData.edadPaciente,
        genero_paciente: formData.generoPaciente,
        direccion_paciente: formData.direccionPaciente,
        telefono_paciente: formData.telefonoPaciente,
        fecha_siniestro: formData.fechaSiniestro || null,
        hora_siniestro: formData.horaSiniestro || null,
        lugar_siniestro: formData.lugarSiniestro,
        tipo_vehiculo: formData.tipoVehiculo,
        placa_vehiculo: formData.placaVehiculo,
        poliza: formData.poliza,
        aseguradora: formData.aseguradora,
        descripcion_siniestro: formData.descripcionSiniestro,
        departamento: formData.departamento,
        ciudad: formData.ciudad,
        sede_prestadora: formData.sedePrestadora,
      }
      await api.post("api/soat/", payload)
      alert("Registro guardado y exportado exitosamente")
      handleExportTXT()
    } catch {
      alert("Error al guardar el registro SOAT")
    }
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nuevo Registro SOAT</h1>
        <p className="text-muted-foreground mt-1">
          Complete todos los datos del accidente
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-secondary">
          <TabsTrigger value="ambulancia" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Ambulance className="h-4 w-4" />
            <span className="hidden sm:inline">Ambulancia</span>
          </TabsTrigger>
          <TabsTrigger value="paciente" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Paciente</span>
          </TabsTrigger>
          <TabsTrigger value="siniestro" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Siniestro</span>
          </TabsTrigger>
          <TabsTrigger value="ips" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">IPS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ambulancia">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Ambulance className="h-5 w-5 text-primary" />
                Datos de la Ambulancia
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Selector principal de ambulancia */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ambulanciaId">Ambulancia <span className="text-destructive">*</span></Label>
                <Select value={ambulanciaId} onValueChange={handleAmbulanciaSelect}>
                  <SelectTrigger id="ambulanciaId">
                    <SelectValue placeholder="Seleccionar ambulancia por placa" />
                  </SelectTrigger>
                  <SelectContent>
                    {ambulancias.length === 0 ? (
                      <SelectItem value="__loading" disabled>Cargando ambulancias...</SelectItem>
                    ) : (
                      ambulancias.map(a => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.placa} — {a.tipo_display}{a.sede_nombre ? ` (${a.sede_nombre})` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos auto-rellenados tras seleccionar ambulancia */}
              {ambulanciaId && (
                <>
                  <div className="space-y-2">
                    <Label>Placa de Ambulancia</Label>
                    <Input value={formData.placaAmbulancia} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Ambulancia</Label>
                    <Input value={formData.tipoAmbulancia} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Sede</Label>
                    <Input value={formData.sede} disabled className="bg-muted" />
                  </div>
                </>
              )}

              {/* Tripulantes: seleccionables desde colaboradores de la sede */}
              <div className="space-y-2">
                <Label htmlFor="tripulante1">Tripulante 1 (Conductor) <span className="text-destructive">*</span></Label>
                {tripulantesFiltrados.length > 0 ? (
                  <Select value={formData.tripulante1} onValueChange={(v) => handleInputChange("tripulante1", v)}>
                    <SelectTrigger id="tripulante1">
                      <SelectValue placeholder="Seleccionar tripulante" />
                    </SelectTrigger>
                    <SelectContent>
                      {tripulantesFiltrados.map(e => (
                        <SelectItem key={e.id} value={`${e.nombre} ${e.apellido}`}>
                          {e.nombre} {e.apellido}{e.cargo ? ` — ${e.cargo}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="tripulante1"
                    placeholder={ambulanciaId ? "Sin colaboradores en esta sede" : "Seleccione una ambulancia primero"}
                    value={formData.tripulante1}
                    onChange={(e) => handleInputChange("tripulante1", e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tripulante2">Tripulante 2 (Paramédico) <span className="text-destructive">*</span></Label>
                {tripulantesFiltrados.length > 0 ? (
                  <Select value={formData.tripulante2} onValueChange={(v) => handleInputChange("tripulante2", v)}>
                    <SelectTrigger id="tripulante2">
                      <SelectValue placeholder="Seleccionar tripulante" />
                    </SelectTrigger>
                    <SelectContent>
                      {tripulantesFiltrados.map(e => (
                        <SelectItem key={e.id} value={`${e.nombre} ${e.apellido}`}>
                          {e.nombre} {e.apellido}{e.cargo ? ` — ${e.cargo}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="tripulante2"
                    placeholder={ambulanciaId ? "Sin colaboradores en esta sede" : "Seleccione una ambulancia primero"}
                    value={formData.tripulante2}
                    onChange={(e) => handleInputChange("tripulante2", e.target.value)}
                  />
                )}
              </div>

              {/* Lista de colaboradores registrados en la sede de la ambulancia */}
              {tripulantesFiltrados.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Colaboradores registrados en esta sede ({tripulantesFiltrados.length})
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border">
                    {tripulantesFiltrados.map(e => (
                      <Badge key={e.id} variant="secondary" className="text-xs">
                        {e.nombre} {e.apellido}{e.cargo ? ` · ${e.cargo}` : ""}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paciente">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                Datos del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombrePaciente">Nombre Completo</Label>
                <Input
                  id="nombrePaciente"
                  placeholder="Nombres y apellidos"
                  value={formData.nombrePaciente}
                  onChange={(e) => handleInputChange("nombrePaciente", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoDocumento">Tipo de Documento <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.tipoDocumento}
                  onValueChange={(value) => handleInputChange("tipoDocumento", value)}
                >
                  <SelectTrigger id="tipoDocumento">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                    <SelectItem value="PA">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentoPaciente">Número de Documento</Label>
                <Input
                  id="documentoPaciente"
                  placeholder="1234567890"
                  value={formData.documentoPaciente}
                  onChange={(e) => handleInputChange("documentoPaciente", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edadPaciente">Edad</Label>
                <Input
                  id="edadPaciente"
                  type="number"
                  placeholder="25"
                  value={formData.edadPaciente}
                  onChange={(e) => handleInputChange("edadPaciente", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generoPaciente">Género <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.generoPaciente}
                  onValueChange={(value) => handleInputChange("generoPaciente", value)}
                >
                  <SelectTrigger id="generoPaciente">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="O">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccionPaciente">Dirección</Label>
                <Input
                  id="direccionPaciente"
                  placeholder="Calle 1 #2-3"
                  value={formData.direccionPaciente}
                  onChange={(e) => handleInputChange("direccionPaciente", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefonoPaciente">Teléfono</Label>
                <Input
                  id="telefonoPaciente"
                  placeholder="3001234567"
                  value={formData.telefonoPaciente}
                  onChange={(e) => handleInputChange("telefonoPaciente", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="siniestro">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Datos del Siniestro
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fechaSiniestro">Fecha del Accidente</Label>
                <Input
                  id="fechaSiniestro"
                  type="date"
                  value={formData.fechaSiniestro}
                  onChange={(e) => handleInputChange("fechaSiniestro", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaSiniestro">Hora del Accidente</Label>
                <Input
                  id="horaSiniestro"
                  type="time"
                  value={formData.horaSiniestro}
                  onChange={(e) => handleInputChange("horaSiniestro", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lugarSiniestro">Lugar del Accidente</Label>
                <Input
                  id="lugarSiniestro"
                  placeholder="Dirección o referencia del lugar"
                  value={formData.lugarSiniestro}
                  onChange={(e) => handleInputChange("lugarSiniestro", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoVehiculo">Tipo de Vehículo Involucrado <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.tipoVehiculo}
                  onValueChange={(value) => handleInputChange("tipoVehiculo", value)}
                >
                  <SelectTrigger id="tipoVehiculo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motocicleta">Motocicleta</SelectItem>
                    <SelectItem value="automovil">Automóvil</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="camion">Camión</SelectItem>
                    <SelectItem value="bicicleta">Bicicleta</SelectItem>
                    <SelectItem value="peaton">Peatón</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="placaVehiculo">Placa del Vehículo</Label>
                <Input
                  id="placaVehiculo"
                  placeholder="ABC-123"
                  value={formData.placaVehiculo}
                  onChange={(e) => handleInputChange("placaVehiculo", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poliza">Número de Póliza</Label>
                <Input
                  id="poliza"
                  placeholder="POL-123456"
                  value={formData.poliza}
                  onChange={(e) => handleInputChange("poliza", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aseguradora">Aseguradora <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.aseguradora}
                  onValueChange={(value) => handleInputChange("aseguradora", value)}
                >
                  <SelectTrigger id="aseguradora">
                    <SelectValue placeholder="Seleccionar aseguradora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sura">Sura</SelectItem>
                    <SelectItem value="bolivar">Seguros Bolívar</SelectItem>
                    <SelectItem value="allianz">Allianz</SelectItem>
                    <SelectItem value="liberty">Liberty</SelectItem>
                    <SelectItem value="mapfre">Mapfre</SelectItem>
                    <SelectItem value="axa">AXA Colpatria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcionSiniestro">Descripción del Accidente</Label>
                <Textarea
                  id="descripcionSiniestro"
                  placeholder="Describa cómo ocurrió el accidente..."
                  className="min-h-[100px]"
                  value={formData.descripcionSiniestro}
                  onChange={(e) => handleInputChange("descripcionSiniestro", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ips">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Building2 className="h-5 w-5 text-primary" />
                Datos IPS
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => handleInputChange("departamento", value)}
                >
                  <SelectTrigger id="departamento">
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valle">Valle del Cauca</SelectItem>
                    <SelectItem value="cauca">Cauca</SelectItem>
                    <SelectItem value="narino">Nariño</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.ciudad}
                  onValueChange={(value) => handleInputChange("ciudad", value)}
                >
                  <SelectTrigger id="ciudad">
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cali">Cali</SelectItem>
                    <SelectItem value="palmira">Palmira</SelectItem>
                    <SelectItem value="buenaventura">Buenaventura</SelectItem>
                    <SelectItem value="tulua">Tuluá</SelectItem>
                    <SelectItem value="buga">Buga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sedePrestadora">Sede Prestadora de Servicios <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.sedePrestadora}
                  onValueChange={(value) => handleInputChange("sedePrestadora", value)}
                >
                  <SelectTrigger id="sedePrestadora">
                    <SelectValue placeholder="Seleccionar sede prestadora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="huv">Hospital Universitario del Valle</SelectItem>
                    <SelectItem value="imbanaco">Clínica Imbanaco</SelectItem>
                    <SelectItem value="valle-lili">Fundación Valle del Lili</SelectItem>
                    <SelectItem value="comfandi">Clínica Comfandi</SelectItem>
                    <SelectItem value="isaias-duarte">Hospital Isaías Duarte Cancino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end">
        <Button onClick={handleSave} variant="outline" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar
        </Button>
        <Button onClick={handleSaveAndExport} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4" />
          Guardar y Exportar
        </Button>
      </div>
    </div>
  )
}
