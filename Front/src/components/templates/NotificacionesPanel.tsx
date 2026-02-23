import { useNavigate } from "react-router-dom";

import Modall from "../organismos/modal";

import { useAuth } from "@/providers/AuthProvider";
import { useNotificaciones } from "@/hooks/Notificaciones/useNotificaciones";
import { formatDateColombia } from "@/utils/dateUtils";

type Props = {
  open: boolean;
  onClose: () => void;
};

// Funcion para obtener badge segun el tipo de notificacion
const getTipoBadge = (titulo: string) => {
  const t = titulo.toLowerCase();
  if (t.includes('stock')) {
    return { color: 'bg-red-100 text-red-800', icon: '⚠️', label: 'Stock Bajo' };
  }
  if (t.includes('caducar') || t.includes('caducidad')) {
    return { color: 'bg-yellow-100 text-yellow-800', icon: '🗓️', label: 'Por Caducar' };
  }
  if (t.includes('movimiento')) {
    return { color: 'bg-blue-100 text-blue-800', icon: '📦', label: 'Movimiento' };
  }
  if (t.includes('ingreso')) {
    return { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Ingreso' };
  }
  return { color: 'bg-gray-100 text-gray-800', icon: '📌', label: 'Notificacion' };
};

export default function NotificacionesPanel({ open, onClose }: Props) {
  const { idUsuario } = useAuth();
  const { notificaciones, isLoading, marcarLeida, refetch } =
    useNotificaciones(idUsuario!);

  const navigate = useNavigate();

  if (isLoading) return <p className="p-4">Cargando notificaciones...</p>;

  return (
    <Modall ModalTitle="Notificaciones" isOpen={open} onOpenChange={onClose}>
      <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Notificaciones</h2>
        </div>

        {notificaciones?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">🔔</p>
            <p>No hay notificaciones.</p>
          </div>
        )}

        {notificaciones?.map((noti) => {
          const badge = getTipoBadge(noti.titulo);
          
          return (
            <div
              key={noti.idNotificacion}
              className={`bg-white dark:bg-zinc-800 shadow-md rounded-xl p-4 border border-gray-200 dark:border-zinc-700 cursor-pointer transition-all hover:shadow-lg ${
                !noti.leido ? 'border-l-4 border-l-red-500' : ''
              }`}
              onClick={() => {
                marcarLeida(noti.idNotificacion);
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{noti.titulo}</h3>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
                {!noti.leido && (
                  <span className="px-2 py-1 text-xs rounded-full bg-primary text-white animate-pulse">
                    Nuevo
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {noti.mensaje}
              </p>
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-zinc-600">
                <p className="text-xs text-gray-400">
                  {new Date(noti.createdAt).toLocaleString('es-ES')}
                </p>
                
                {/* Boton marcar como leida */}
                {!noti.leido && (
                  <button
                    className="text-primary underline text-sm hover:text-primary/80"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await marcarLeida(noti.idNotificacion);
                    }}
                  >
                    Marcar como leida
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modall>
  );
}
