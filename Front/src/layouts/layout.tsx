import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "@/components/templates/sidebar";
import { Nav } from "@/components/templates/Navbar";
import { DarkMode } from "@/components/molecules/DarkMode";
import NotificacionesPanel from "@/components/templates/NotificacionesPanel";
import { useAuth } from "@/providers/AuthProvider";
import { useSocketNotificaciones } from "@/hooks/Notificaciones/useSocketNotificaciones";
import { useNotificaciones } from "@/hooks/Notificaciones/useNotificaciones";
import usePermissions from "@/hooks/Usuarios/usePermissions";
import { useQueryClient } from "@tanstack/react-query";

export default function Layout() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { idUsuario } = useAuth();
  const { userHasPermission } = usePermissions();
  const queryClient = useQueryClient();

  const { notificaciones } = useNotificaciones(idUsuario!);
  const cantidadNoLeidas = notificaciones?.filter((n) => !n.leido).length ?? 0;

  // Solo mostrar notificaciones para Administrador (tiene permiso 71 - Exportar PDF)
  const isAdmin = userHasPermission(71);

  useEffect(() => {
    if (idUsuario) {
      console.log("✅ idUsuario disponible:", idUsuario);
    }
  }, [idUsuario]);

  // Callback para manejar nuevas notificaciones en tiempo real
  const handleNuevaNotificacion = (noti: any) => {
    console.log("🔔 Nueva notificación:", noti);
    // Invalidar la query para refetch y actualizar la lista
    queryClient.invalidateQueries({ queryKey: ["notificaciones", idUsuario] });
  };

  useSocketNotificaciones(idUsuario!, handleNuevaNotificacion);

  if (!idUsuario) {
    return <div className="text-center mt-10">🔄 Cargando usuario...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-bg-primary text-text-primary">
        <Nav
          cantidadNoLeidas={cantidadNoLeidas}
          onOpenNotifications={() => setIsNotifOpen(true)}
          showNotifications={isAdmin}
        >
          <DarkMode />
        </Nav>

        <Outlet />

        {isAdmin && (
          <NotificacionesPanel
            open={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
