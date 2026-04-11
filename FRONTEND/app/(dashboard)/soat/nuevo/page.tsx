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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ambulance, User, AlertTriangle, Building2, Download, Save } from "lucide-react"

export default function NuevoSOATPage() {
  const [activeTab, setActiveTab] = useState("ambulancia")
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

  const handleSave = () => {
    // Store in localStorage for now (would be database in production)
    const registros = JSON.parse(localStorage.getItem("soat_registros") || "[]")
    registros.push({
      ...formData,
      id: Date.now(),
      fechaRegistro: new Date().toISOString(),
    })
    localStorage.setItem("soat_registros", JSON.stringify(registros))
    alert("Registro guardado exitosamente")
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
              <div className="space-y-2">
                <Label htmlFor="placaAmbulancia">Placa de Ambulancia</Label>
                <Input
                  id="placaAmbulancia"
                  placeholder="AMB-001"
                  value={formData.placaAmbulancia}
                  onChange={(e) => handleInputChange("placaAmbulancia", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoAmbulancia">Tipo de Ambulancia</Label>
                <Select
                  value={formData.tipoAmbulancia}
                  onValueChange={(value) => handleInputChange("tipoAmbulancia", value)}
                >
                  <SelectTrigger id="tipoAmbulancia">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basica">Básica</SelectItem>
                    <SelectItem value="medicalizada">Medicalizada</SelectItem>
                    <SelectItem value="uci">UCI Móvil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripulante1">Tripulante 1 (Conductor)</Label>
                <Input
                  id="tripulante1"
                  placeholder="Nombre completo"
                  value={formData.tripulante1}
                  onChange={(e) => handleInputChange("tripulante1", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripulante2">Tripulante 2 (Paramédico)</Label>
                <Input
                  id="tripulante2"
                  placeholder="Nombre completo"
                  value={formData.tripulante2}
                  onChange={(e) => handleInputChange("tripulante2", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sede">Sede</Label>
                <Select
                  value={formData.sede}
                  onValueChange={(value) => handleInputChange("sede", value)}
                >
                  <SelectTrigger id="sede">
                    <SelectValue placeholder="Seleccionar sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sede-norte">Sede Norte</SelectItem>
                    <SelectItem value="sede-sur">Sede Sur</SelectItem>
                    <SelectItem value="sede-este">Sede Este</SelectItem>
                    <SelectItem value="sede-oeste">Sede Oeste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generoPaciente">Género</Label>
                <Select
                  value={formData.generoPaciente}
                  onValueChange={(value) => handleInputChange("generoPaciente", value)}
                >
                  <SelectTrigger id="generoPaciente">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefonoPaciente">Teléfono</Label>
                <Input
                  id="telefonoPaciente"
                  placeholder="3001234567"
                  value={formData.telefonoPaciente}
                  onChange={(e) => handleInputChange("telefonoPaciente", e.target.value)}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaSiniestro">Hora del Accidente</Label>
                <Input
                  id="horaSiniestro"
                  type="time"
                  value={formData.horaSiniestro}
                  onChange={(e) => handleInputChange("horaSiniestro", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lugarSiniestro">Lugar del Accidente</Label>
                <Input
                  id="lugarSiniestro"
                  placeholder="Dirección o referencia del lugar"
                  value={formData.lugarSiniestro}
                  onChange={(e) => handleInputChange("lugarSiniestro", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoVehiculo">Tipo de Vehículo Involucrado</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poliza">Número de Póliza</Label>
                <Input
                  id="poliza"
                  placeholder="POL-123456"
                  value={formData.poliza}
                  onChange={(e) => handleInputChange("poliza", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aseguradora">Aseguradora</Label>
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
                <Label htmlFor="departamento">Departamento</Label>
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
                <Label htmlFor="ciudad">Ciudad</Label>
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
                <Label htmlFor="sedePrestadora">Sede Prestadora de Servicios</Label>
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
        <Button variant="outline" onClick={handleExportTXT} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar TXT
        </Button>
        <Button onClick={handleSave} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" />
          Guardar Registro
        </Button>
      </div>
    </div>
  )
}
