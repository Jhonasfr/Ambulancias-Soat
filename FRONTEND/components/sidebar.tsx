"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  User,
  Building2,
  MapPin,
  Briefcase,
  Users,
  Ambulance,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "SOAT",
    href: "/soat",
    icon: FileText,
    children: [
      { title: "Nuevo Registro", href: "/soat/nuevo" },
      { title: "Historial", href: "/soat/historial" },
    ],
  },
  {
    title: "Ajustes",
    href: "/ajustes",
    icon: Settings,
    children: [
      { title: "Organización", href: "/ajustes/organizacion" },
      { title: "Sedes", href: "/ajustes/sedes" },
      { title: "Cargos", href: "/ajustes/cargos" },
      { title: "Empleados", href: "/ajustes/empleados" },
      { title: "Ambulancias", href: "/ajustes/ambulancias" },
    ],
  },
]

const settingsIcons: Record<string, React.ElementType> = {
  Organización: Building2,
  Sedes: MapPin,
  Cargos: Briefcase,
  Empleados: Users,
  Ambulancias: Ambulance,
}

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["SOAT", "Ajustes"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Ambulance className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Ambulancias</h1>
          <p className="text-xs text-sidebar-foreground/70">Cali, Colombia</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedItems.includes(item.title) && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = settingsIcons[child.title]
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            pathname === child.href
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          {ChildIcon && <ChildIcon className="h-4 w-4" />}
                          {child.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4 space-y-2">
        <Link
          href="/perfil"
          onClick={() => setIsMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/perfil"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <User className="h-5 w-5" />
          Mi Perfil
        </Link>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-red-300 transition-colors">
          <LogOut className="h-5 w-5" />
          Salir
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col bg-sidebar fixed left-0 top-0">
        <SidebarContent />
      </aside>
    </>
  )
}
