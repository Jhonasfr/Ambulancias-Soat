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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "Carlos Andrés Martínez",
    documento: "1234567890",
    tipoDocumento: "CC",
    email: "carlos.martinez@ambulanciascali.com",
    telefono: "3001234567",
    direccion: "Calle 10 #5-20, Barrio El Poblado",
    cargo: "Paramédico",
    sede: "Sede Norte",
    fechaIngreso: "2020-03-15",
    rh: "O+",
    contactoEmergencia: "María García - 3109876543",
    licencia: "5678901234",
    especialidad: "Atención Prehospitalaria",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    localStorage.setItem("perfil", JSON.stringify(formData))
    setIsEditing(false)
    alert("Perfil actualizado exitosamente")
  }

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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Información personal del paramédico
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(formData.nombre)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-foreground">{formData.nombre}</h2>
              <p className="text-muted-foreground">{formData.cargo}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {formData.sede}
              </div>
              <Separator className="my-4" />
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-foreground truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{formData.telefono}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    Desde {new Date(formData.fechaIngreso).toLocaleDateString("es-CO", { year: "numeric", month: "long" })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              Datos Personales
            </CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={!isEditing ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            >
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo</Label>
                  <Select
                    value={formData.tipoDocumento}
                    onValueChange={(value) => handleInputChange("tipoDocumento", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="tipoDocumento">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">CC</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="PA">PA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="documento">Documento</Label>
                  <Input
                    id="documento"
                    value={formData.documento}
                    onChange={(e) => handleInputChange("documento", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Información Laboral</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange("cargo", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sede">Sede</Label>
                <Select
                  value={formData.sede}
                  onValueChange={(value) => handleInputChange("sede", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="sede">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sede Norte">Sede Norte</SelectItem>
                    <SelectItem value="Sede Sur">Sede Sur</SelectItem>
                    <SelectItem value="Sede Este">Sede Este</SelectItem>
                    <SelectItem value="Sede Oeste">Sede Oeste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="licencia">Número de Licencia</Label>
                <Input
                  id="licencia"
                  value={formData.licencia}
                  onChange={(e) => handleInputChange("licencia", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  value={formData.especialidad}
                  onChange={(e) => handleInputChange("especialidad", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Información de Emergencia</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rh">Tipo de Sangre (RH)</Label>
                <Select
                  value={formData.rh}
                  onValueChange={(value) => handleInputChange("rh", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="rh">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactoEmergencia">Contacto de Emergencia</Label>
                <Input
                  id="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={(e) => handleInputChange("contactoEmergencia", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nombre - Teléfono"
                />
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
