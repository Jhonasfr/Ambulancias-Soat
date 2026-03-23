"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Eye, Download, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RegistroSOAT {
  id: number
  fechaRegistro: string
  placaAmbulancia: string
  nombrePaciente: string
  documentoPaciente: string
  tipoDocumento: string
  fechaSiniestro: string
  lugarSiniestro: string
  tipoVehiculo: string
  aseguradora: string
  sedePrestadora: string
  tripulante1: string
  tripulante2: string
  sede: string
  edadPaciente: string
  generoPaciente: string
  direccionPaciente: string
  telefonoPaciente: string
  horaSiniestro: string
  placaVehiculo: string
  poliza: string
  descripcionSiniestro: string
  departamento: string
  ciudad: string
  tipoAmbulancia: string
}

// Sample data for demonstration
const sampleData: RegistroSOAT[] = [
  {
    id: 1,
    fechaRegistro: "2024-03-20T10:30:00",
    placaAmbulancia: "AMB-001",
    nombrePaciente: "Juan Carlos Pérez",
    documentoPaciente: "1234567890",
    tipoDocumento: "CC",
    fechaSiniestro: "2024-03-20",
    lugarSiniestro: "Calle 5 con Carrera 15",
    tipoVehiculo: "motocicleta",
    aseguradora: "sura",
    sedePrestadora: "huv",
    tripulante1: "Carlos Martínez",
    tripulante2: "María López",
    sede: "sede-norte",
    edadPaciente: "35",
    generoPaciente: "masculino",
    direccionPaciente: "Calle 10 #5-20",
    telefonoPaciente: "3001234567",
    horaSiniestro: "08:30",
    placaVehiculo: "ABC-123",
    poliza: "POL-001234",
    descripcionSiniestro: "Colisión con vehículo particular",
    departamento: "valle",
    ciudad: "cali",
    tipoAmbulancia: "medicalizada",
  },
  {
    id: 2,
    fechaRegistro: "2024-03-19T14:15:00",
    placaAmbulancia: "AMB-002",
    nombrePaciente: "Ana María García",
    documentoPaciente: "9876543210",
    tipoDocumento: "CC",
    fechaSiniestro: "2024-03-19",
    lugarSiniestro: "Autopista Sur-Oriental Km 5",
    tipoVehiculo: "automovil",
    aseguradora: "bolivar",
    sedePrestadora: "valle-lili",
    tripulante1: "Pedro Sánchez",
    tripulante2: "Laura Gómez",
    sede: "sede-sur",
    edadPaciente: "28",
    generoPaciente: "femenino",
    direccionPaciente: "Carrera 8 #20-15",
    telefonoPaciente: "3109876543",
    horaSiniestro: "13:45",
    placaVehiculo: "XYZ-789",
    poliza: "POL-005678",
    descripcionSiniestro: "Accidente múltiple en autopista",
    departamento: "valle",
    ciudad: "cali",
    tipoAmbulancia: "uci",
  },
  {
    id: 3,
    fechaRegistro: "2024-03-18T09:00:00",
    placaAmbulancia: "AMB-001",
    nombrePaciente: "Roberto Díaz",
    documentoPaciente: "5678901234",
    tipoDocumento: "CC",
    fechaSiniestro: "2024-03-18",
    lugarSiniestro: "Avenida 6N con Calle 25",
    tipoVehiculo: "peaton",
    aseguradora: "allianz",
    sedePrestadora: "imbanaco",
    tripulante1: "Carlos Martínez",
    tripulante2: "María López",
    sede: "sede-norte",
    edadPaciente: "45",
    generoPaciente: "masculino",
    direccionPaciente: "Calle 25 #6N-30",
    telefonoPaciente: "3205678901",
    horaSiniestro: "07:30",
    placaVehiculo: "N/A",
    poliza: "POL-009012",
    descripcionSiniestro: "Atropellamiento en paso peatonal",
    departamento: "valle",
    ciudad: "cali",
    tipoAmbulancia: "basica",
  },
]

const vehicleLabels: Record<string, string> = {
  motocicleta: "Motocicleta",
  automovil: "Automóvil",
  bus: "Bus",
  camion: "Camión",
  bicicleta: "Bicicleta",
  peaton: "Peatón",
}

const aseguradoraLabels: Record<string, string> = {
  sura: "Sura",
  bolivar: "Seguros Bolívar",
  allianz: "Allianz",
  liberty: "Liberty",
  mapfre: "Mapfre",
  axa: "AXA Colpatria",
}

const sedeLabels: Record<string, string> = {
  huv: "Hospital Universitario del Valle",
  imbanaco: "Clínica Imbanaco",
  "valle-lili": "Fundación Valle del Lili",
  comfandi: "Clínica Comfandi",
  "isaias-duarte": "Hospital Isaías Duarte Cancino",
}

export default function HistorialPage() {
  const [registros, setRegistros] = useState<RegistroSOAT[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroSOAT | null>(null)

  useEffect(() => {
    // Load from localStorage or use sample data
    const stored = localStorage.getItem("soat_registros")
    if (stored) {
      const parsed = JSON.parse(stored)
      setRegistros([...sampleData, ...parsed])
    } else {
      setRegistros(sampleData)
    }
  }, [])

  const filteredRegistros = registros.filter(
    (registro) =>
      registro.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.documentoPaciente.includes(searchTerm) ||
      registro.placaAmbulancia.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportRegistro = (registro: RegistroSOAT) => {
    const content = `
REGISTRO SOAT - Sistema de Ambulancias Cali
==========================================

DATOS DE AMBULANCIA
-------------------
Placa: ${registro.placaAmbulancia}
Tipo: ${registro.tipoAmbulancia}
Tripulante 1: ${registro.tripulante1}
Tripulante 2: ${registro.tripulante2}
Sede: ${registro.sede}

DATOS DEL PACIENTE
------------------
Nombre: ${registro.nombrePaciente}
Documento: ${registro.tipoDocumento} ${registro.documentoPaciente}
Edad: ${registro.edadPaciente}
Género: ${registro.generoPaciente}
Dirección: ${registro.direccionPaciente}
Teléfono: ${registro.telefonoPaciente}

DATOS DEL SINIESTRO
-------------------
Fecha: ${registro.fechaSiniestro}
Hora: ${registro.horaSiniestro}
Lugar: ${registro.lugarSiniestro}
Tipo de Vehículo: ${vehicleLabels[registro.tipoVehiculo] || registro.tipoVehiculo}
Placa Vehículo: ${registro.placaVehiculo}
Póliza: ${registro.poliza}
Aseguradora: ${aseguradoraLabels[registro.aseguradora] || registro.aseguradora}
Descripción: ${registro.descripcionSiniestro}

DATOS IPS
---------
Departamento: ${registro.departamento}
Ciudad: ${registro.ciudad}
Sede Prestadora: ${sedeLabels[registro.sedePrestadora] || registro.sedePrestadora}

==========================================
Registro ID: ${registro.id}
Fecha de Registro: ${new Date(registro.fechaRegistro).toLocaleString("es-CO")}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SOAT_${registro.documentoPaciente}_${registro.fechaSiniestro}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Historial SOAT</h1>
        <p className="text-muted-foreground mt-1">
          Busque y consulte registros anteriores
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Registros
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, documento o placa..."
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ambulancia</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead className="hidden md:table-cell">Documento</TableHead>
                  <TableHead className="hidden lg:table-cell">Tipo Vehículo</TableHead>
                  <TableHead className="hidden lg:table-cell">IPS</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistros.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>
                        {new Date(registro.fechaSiniestro).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{registro.placaAmbulancia}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{registro.nombrePaciente}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {registro.tipoDocumento} {registro.documentoPaciente}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {vehicleLabels[registro.tipoVehiculo] || registro.tipoVehiculo}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="truncate max-w-[150px] block">
                          {sedeLabels[registro.sedePrestadora] || registro.sedePrestadora}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedRegistro(registro)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">Detalle del Registro</DialogTitle>
                              </DialogHeader>
                              {selectedRegistro && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold text-primary mb-2">Ambulancia</h4>
                                      <p className="text-sm text-foreground">Placa: {selectedRegistro.placaAmbulancia}</p>
                                      <p className="text-sm text-foreground">Tripulante 1: {selectedRegistro.tripulante1}</p>
                                      <p className="text-sm text-foreground">Tripulante 2: {selectedRegistro.tripulante2}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-primary mb-2">Paciente</h4>
                                      <p className="text-sm text-foreground">Nombre: {selectedRegistro.nombrePaciente}</p>
                                      <p className="text-sm text-foreground">Doc: {selectedRegistro.tipoDocumento} {selectedRegistro.documentoPaciente}</p>
                                      <p className="text-sm text-foreground">Edad: {selectedRegistro.edadPaciente} años</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-primary mb-2">Siniestro</h4>
                                    <p className="text-sm text-foreground">Fecha: {selectedRegistro.fechaSiniestro} {selectedRegistro.horaSiniestro}</p>
                                    <p className="text-sm text-foreground">Lugar: {selectedRegistro.lugarSiniestro}</p>
                                    <p className="text-sm text-foreground">Tipo: {vehicleLabels[selectedRegistro.tipoVehiculo]}</p>
                                    <p className="text-sm text-foreground">Aseguradora: {aseguradoraLabels[selectedRegistro.aseguradora]}</p>
                                    <p className="text-sm text-muted-foreground mt-2">{selectedRegistro.descripcionSiniestro}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-primary mb-2">IPS</h4>
                                    <p className="text-sm text-foreground">{sedeLabels[selectedRegistro.sedePrestadora]}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRegistro.ciudad}, {selectedRegistro.departamento}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => exportRegistro(registro)}
                          >
                            <Download className="h-4 w-4" />
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
