"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Save } from "lucide-react"
import api from "@/app/services/axios"

export default function OrganizacionPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
    email: "",
    representante: "",
    descripcion: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("api/organizacion/").then((res: { data: typeof formData & Record<string, string> }) => {
      const d = res.data
      setFormData({
        nombre: d.nombre ?? "",
        nit: d.nit ?? "",
        direccion: d.direccion ?? "",
        telefono: d.telefono ?? "",
        email: d.email ?? "",
        representante: d.representante ?? "",
        descripcion: d.descripcion ?? "",
      })
    }).catch(() => {})
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.post("api/organizacion/", formData)
      alert("Información guardada exitosamente")
    } catch {
      alert("Error al guardar la información")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Organización</h1>
        <p className="text-muted-foreground mt-1">
          Información general de la empresa
        </p>
      </div>

      <Card className="border-0 shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            Datos de la Organización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Empresa</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                value={formData.nit}
                onChange={(e) => handleInputChange("nit", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="representante">Representante Legal</Label>
              <Input
                id="representante"
                value={formData.representante}
                onChange={(e) => handleInputChange("representante", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              className="min-h-[100px]"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
            />
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
