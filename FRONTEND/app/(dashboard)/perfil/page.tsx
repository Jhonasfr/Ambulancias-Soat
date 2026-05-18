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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getPerfil, actualizarPerfil, getSedes, type PerfilData, type Sede } from "@/app/services/ambulancia"

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sedes, setSedes] = useState<Sede[]>([])
  const [perfilOriginal, setPerfilOriginal] = useState<PerfilData | null>(null)
  const [formData, setFormData] = useState({
    nombre_colaborador: "",
    apellido_colaborador: "",
    cc_colaborador: "",
    tipo_documento: "CC",
    correo_colaborador: "",
    telefo_colaborador: "",
    direccion: "",
    nombre_cargo: "",
    nombre_sede: "",
    sede_id: "",
    numero_licencia: "",
    especialidad: "",
    tipo_sangre: "",
    contacto_emergencia: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfil, sedesData] = await Promise.all([getPerfil(), getSedes()])
        setPerfilOriginal(perfil)
        setSedes(sedesData)
        setFormData({
          nombre_colaborador: perfil.nombre_colaborador ?? "",
          apellido_colaborador: perfil.apellido_colaborador ?? "",
          cc_colaborador: perfil.cc_colaborador ?? "",
          tipo_documento: perfil.tipo_documento ?? "CC",
          correo_colaborador: perfil.correo_colaborador ?? "",
          telefo_colaborador: perfil.telefo_colaborador ?? "",
          direccion: perfil.direccion ?? "",
          nombre_cargo: perfil.nombre_cargo ?? "",
          nombre_sede: perfil.nombre_sede ?? "",
          sede_id: sedesData.find((s) => s.nombre === perfil.nombre_sede)
            ? String(sedesData.find((s) => s.nombre === perfil.nombre_sede)!.idsede)
            : "",
          numero_licencia: perfil.numero_licencia ?? "",
          especialidad: perfil.especialidad ?? "",
          tipo_sangre: perfil.tipo_sangre ?? "",
          contacto_emergencia: perfil.contacto_emergencia ?? "",
        })
      } catch {
        // keep defaults if API fails
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await actualizarPerfil({
        nombre_colaborador: formData.nombre_colaborador,
        apellido_colaborador: formData.apellido_colaborador,
        correo_colaborador: formData.correo_colaborador,
        telefo_colaborador: formData.telefo_colaborador,
        tipo_documento: formData.tipo_documento,
        direccion: formData.direccion,
        sede_id: formData.sede_id ? Number(formData.sede_id) : undefined,
        numero_licencia: formData.numero_licencia,
        especialidad: formData.especialidad,
        tipo_sangre: formData.tipo_sangre,
        contacto_emergencia: formData.contacto_emergencia,
      })
      setIsEditing(false)
      alert("Perfil actualizado exitosamente")
    } catch {
      alert("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (perfilOriginal) {
      setFormData({
        nombre_colaborador: perfilOriginal.nombre_colaborador ?? "",
        apellido_colaborador: perfilOriginal.apellido_colaborador ?? "",
        cc_colaborador: perfilOriginal.cc_colaborador ?? "",
        tipo_documento: perfilOriginal.tipo_documento ?? "CC",
        correo_colaborador: perfilOriginal.correo_colaborador ?? "",
        telefo_colaborador: perfilOriginal.telefo_colaborador ?? "",
        direccion: perfilOriginal.direccion ?? "",
        nombre_cargo: perfilOriginal.nombre_cargo ?? "",
        nombre_sede: perfilOriginal.nombre_sede ?? "",
        sede_id: sedes.find((s) => s.nombre === perfilOriginal.nombre_sede)
          ? String(sedes.find((s) => s.nombre === perfilOriginal.nombre_sede)!.idsede)
          : "",
        numero_licencia: perfilOriginal.numero_licencia ?? "",
        especialidad: perfilOriginal.especialidad ?? "",
        tipo_sangre: perfilOriginal.tipo_sangre ?? "",
        contacto_emergencia: perfilOriginal.contacto_emergencia ?? "",
      })
    }
    setIsEditing(false)
  }

  const getInitials = (nombre: string, apellido: string) =>
    `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase()

  const nombreCompleto = `${formData.nombre_colaborador} ${formData.apellido_colaborador}`.trim()

  if (loading) {
    return (
      <div className="p-8 pt-16 md:pt-8 flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 pt-16 md:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Información personal del paramédico</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(formData.nombre_colaborador, formData.apellido_colaborador)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-foreground">{nombreCompleto || "—"}</h2>
              <p className="text-muted-foreground">{formData.nombre_cargo || "—"}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {formData.nombre_sede || "—"}
              </div>
              <Separator className="my-4" />
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-foreground truncate">{formData.correo_colaborador || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{formData.telefo_colaborador || "—"}</span>
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
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className={!isEditing ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            >
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={formData.nombre_colaborador}
                  onChange={(e) => handleInputChange("nombre_colaborador", e.target.value)}
                  disabled={!isEditing} placeholder="Nombre" />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input value={formData.apellido_colaborador}
                  onChange={(e) => handleInputChange("apellido_colaborador", e.target.value)}
                  disabled={!isEditing} placeholder="Apellido" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo Doc.</Label>
                <Select value={formData.tipo_documento}
                  onValueChange={(v) => handleInputChange("tipo_documento", v)}
                  disabled={!isEditing}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">CC</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="PA">PA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Documento</Label>
                <Input value={formData.cc_colaborador} disabled placeholder="Número de documento" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <Input type="email" value={formData.correo_colaborador}
                  onChange={(e) => handleInputChange("correo_colaborador", e.target.value)}
                  disabled={!isEditing} placeholder="correo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={formData.telefo_colaborador}
                  onChange={(e) => handleInputChange("telefo_colaborador", e.target.value)}
                  disabled={!isEditing} placeholder="Número de teléfono" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                disabled={!isEditing} placeholder="Dirección de residencia" />
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Información Laboral</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input value={formData.nombre_cargo} disabled />
              </div>
              <div className="space-y-2">
                <Label>Sede</Label>
                <Select value={formData.sede_id}
                  onValueChange={(v) => {
                    const sede = sedes.find((s) => String(s.idsede) === v)
                    setFormData(p => ({ ...p, sede_id: v, nombre_sede: sede?.nombre ?? "" }))
                  }}
                  disabled={!isEditing}>
                  <SelectTrigger><SelectValue placeholder={formData.nombre_sede || "Seleccionar"} /></SelectTrigger>
                  <SelectContent>
                    {sedes.map((s) => (
                      <SelectItem key={s.idsede} value={String(s.idsede)}>{s.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Número de Licencia</Label>
                <Input value={formData.numero_licencia}
                  onChange={(e) => handleInputChange("numero_licencia", e.target.value)}
                  disabled={!isEditing} placeholder="N° de licencia" />
              </div>
              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Input value={formData.especialidad}
                  onChange={(e) => handleInputChange("especialidad", e.target.value)}
                  disabled={!isEditing} placeholder="Ej: Atención Prehospitalaria" />
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Información de Emergencia</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de Sangre (RH)</Label>
                <Select value={formData.tipo_sangre}
                  onValueChange={(v) => handleInputChange("tipo_sangre", v)}
                  disabled={!isEditing}>
                  <SelectTrigger><SelectValue placeholder="Tipo de sangre" /></SelectTrigger>
                  <SelectContent>
                    {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((rh) => (
                      <SelectItem key={rh} value={rh}>{rh}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contacto de Emergencia</Label>
                <Input value={formData.contacto_emergencia}
                  onChange={(e) => handleInputChange("contacto_emergencia", e.target.value)}
                  disabled={!isEditing} placeholder="Nombre - Teléfono" />
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSave} disabled={saving}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

