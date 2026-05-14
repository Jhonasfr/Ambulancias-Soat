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
import api from "@/app/services/axios"

interface RegistroSOAT {
  idregistro: number
  fecha_registro: string
  placa_ambulancia: string
  nombre_paciente: string
  documento_paciente: string
  tipo_documento: string
  fecha_siniestro: string
  lugar_siniestro: string
  tipo_vehiculo: string
  aseguradora: string
  sede_prestadora: string
  tripulante1: string
  tripulante2: string
  sede: number | null
  sede_nombre: string
  edad_paciente: string
  genero_paciente: string
  direccion_paciente: string
  telefono_paciente: string
  hora_siniestro: string
  placa_vehiculo: string
  poliza: string
  descripcion_siniestro: string
  departamento: string
  ciudad: string
  tipo_ambulancia: string
}

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

export default function HistorialPage() {
  const [registros, setRegistros] = useState<RegistroSOAT[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroSOAT | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const fetchRegistros = async (search = "", pg = 1) => {
    try {
      const res = await api.get("api/soat/", {
        params: { search, page: pg, page_size: PAGE_SIZE },
      })
      setRegistros(res.data.results ?? [])
      setTotal(res.data.count ?? 0)
    } catch {
      setRegistros([])
    }
  }

  useEffect(() => { fetchRegistros(searchTerm, page) }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchRegistros(searchTerm, 1)
  }

  const openDetail = async (registro: RegistroSOAT) => {
    try {
      const res = await api.get(`api/soat/${registro.idregistro}/`)
      setSelectedRegistro(res.data)
    } catch {
      setSelectedRegistro(registro)
    }
  }

  const exportRegistro = async (registro: RegistroSOAT) => {
    try {
      const res = await api.get(`api/soat/${registro.idregistro}/exportar/`, {
        responseType: "blob",
      })
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/plain" }))
      const a = document.createElement("a")
      a.href = url
      a.download = `SOAT_${registro.documento_paciente}_${registro.fecha_siniestro}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert("Error al exportar el registro")
    }
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
              Registros ({total})
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, documento o placa..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
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
                  <TableHead className="hidden lg:table-cell">Sede</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  registros.map((registro) => (
                    <TableRow key={registro.idregistro}>
                      <TableCell>
                        {registro.fecha_siniestro
                          ? new Date(registro.fecha_siniestro).toLocaleDateString("es-CO")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{registro.placa_ambulancia}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{registro.nombre_paciente}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {registro.tipo_documento} {registro.documento_paciente}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {vehicleLabels[registro.tipo_vehiculo] || registro.tipo_vehiculo}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="truncate max-w-[150px] block">
                          {registro.sede_nombre || registro.sede_prestadora || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDetail(registro)}
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
                                      <p className="text-sm text-foreground">Placa: {selectedRegistro.placa_ambulancia}</p>
                                      <p className="text-sm text-foreground">Tripulante 1: {selectedRegistro.tripulante1}</p>
                                      <p className="text-sm text-foreground">Tripulante 2: {selectedRegistro.tripulante2}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-primary mb-2">Paciente</h4>
                                      <p className="text-sm text-foreground">Nombre: {selectedRegistro.nombre_paciente}</p>
                                      <p className="text-sm text-foreground">Doc: {selectedRegistro.tipo_documento} {selectedRegistro.documento_paciente}</p>
                                      <p className="text-sm text-foreground">Edad: {selectedRegistro.edad_paciente} años</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-primary mb-2">Siniestro</h4>
                                    <p className="text-sm text-foreground">Fecha: {selectedRegistro.fecha_siniestro} {selectedRegistro.hora_siniestro}</p>
                                    <p className="text-sm text-foreground">Lugar: {selectedRegistro.lugar_siniestro}</p>
                                    <p className="text-sm text-foreground">Tipo: {vehicleLabels[selectedRegistro.tipo_vehiculo] || selectedRegistro.tipo_vehiculo}</p>
                                    <p className="text-sm text-foreground">Aseguradora: {aseguradoraLabels[selectedRegistro.aseguradora] || selectedRegistro.aseguradora}</p>
                                    <p className="text-sm text-muted-foreground mt-2">{selectedRegistro.descripcion_siniestro}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-primary mb-2">IPS</h4>
                                    <p className="text-sm text-foreground">{selectedRegistro.sede_prestadora}</p>
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

          {total > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Página {page} de {Math.ceil(total / PAGE_SIZE)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(total / PAGE_SIZE)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}