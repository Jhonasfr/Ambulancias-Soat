"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import authService from "@/app/services/authService";
import api from "@/app/services/axios";

interface Cargo {
  idcargo: number;
  nombrecargo: string;
}

interface Nivel {
  idnivel: number;
  nombrenivel: string;
}

interface Regional {
  idregional: number;
  nombreregional: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    usuario: "",
    password: "",
    cc_colaborador: "",
    nombre_colaborador: "",
    apellido_colaborador: "",
    correo_colaborador: "",
    telefo_colaborador: "",
    cargo_colaborador: "",
    nivel_colaborador: "",
    regional_colab: "",
  });

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [regionales, setRegionales] = useState<Regional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cargosRes, nivelesRes, regionalesRes] = await Promise.all([
          api.get("user/Cargo/"),
          api.get("user/Nivel/"),
          api.get("user/Region/"),
        ]);
        setCargos(cargosRes.data.results ?? cargosRes.data);
        setNiveles(nivelesRes.data.results ?? nivelesRes.data);
        setRegionales(regionalesRes.data.results ?? regionalesRes.data);
      } catch {
        setError("No se pudieron cargar las opciones del formulario.");
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      usuario: form.usuario,
      password: form.password,
      idcolaborador: {
        cc_colaborador: form.cc_colaborador,
        nombre_colaborador: form.nombre_colaborador,
        apellido_colaborador: form.apellido_colaborador,
        correo_colaborador: form.correo_colaborador,
        telefo_colaborador: form.telefo_colaborador,
        cargo_colaborador: Number(form.cargo_colaborador),
        nivel_colaborador: Number(form.nivel_colaborador),
        regional_colab: Number(form.regional_colab),
      },
    };

    try {
      await authService.register(payload);
      setSuccess("Usuario registrado correctamente.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Error al registrar el usuario.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Registrar usuario</CardTitle>
          <p className="text-sm text-muted-foreground">
            Completa los datos para crear un nuevo colaborador
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Credenciales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  name="usuario"
                  placeholder="Nombre de usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Datos del colaborador */}
            <div className="space-y-2">
              <Label htmlFor="cc_colaborador">Cédula</Label>
              <Input
                id="cc_colaborador"
                name="cc_colaborador"
                placeholder="Número de cédula"
                value={form.cc_colaborador}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_colaborador">Nombre</Label>
                <Input
                  id="nombre_colaborador"
                  name="nombre_colaborador"
                  placeholder="Nombre"
                  value={form.nombre_colaborador}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido_colaborador">Apellido</Label>
                <Input
                  id="apellido_colaborador"
                  name="apellido_colaborador"
                  placeholder="Apellido"
                  value={form.apellido_colaborador}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="correo_colaborador">Correo</Label>
                <Input
                  id="correo_colaborador"
                  name="correo_colaborador"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.correo_colaborador}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefo_colaborador">Teléfono</Label>
                <Input
                  id="telefo_colaborador"
                  name="telefo_colaborador"
                  placeholder="Número de teléfono"
                  value={form.telefo_colaborador}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Select
                  value={form.cargo_colaborador}
                  onValueChange={(v) => handleSelect("cargo_colaborador", v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((c) => (
                      <SelectItem key={c.idcargo} value={String(c.idcargo)}>
                        {c.nombrecargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select
                  value={form.nivel_colaborador}
                  onValueChange={(v) => handleSelect("nivel_colaborador", v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveles.map((n) => (
                      <SelectItem key={n.idnivel} value={String(n.idnivel)}>
                        {n.nombrenivel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Regional</Label>
                <Select
                  value={form.regional_colab}
                  onValueChange={(v) => handleSelect("regional_colab", v)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionales.map((r) => (
                      <SelectItem key={r.idregional} value={String(r.idregional)}>
                        {r.nombreregional}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 text-center">{success}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrar usuario"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
