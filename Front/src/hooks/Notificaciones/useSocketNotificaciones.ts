import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import { Notificacion } from "@/types/Notificacion";

const SOCKET_URL = import.meta.env.VITE_SOCKET_BASE_URL;

export function useSocketNotificaciones(
  usuarioId: number,
  onNotificacion: (noti: Notificacion) => void,
) {
  const socketRef = useRef<Socket | null>(null);
  
  // Memoizar el callback para evitar reconexiones
  const handleNotificacion = useCallback((noti: Notificacion) => {
    onNotificacion(noti);
  }, [onNotificacion]);

  useEffect(() => {
    if (!usuarioId || usuarioId <= 0) {
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        idUsuario: usuarioId.toString(),
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", `usuario_${usuarioId}`);
      console.log("✅ Socket conectado:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión Socket.IO:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Desconectado del socket:", reason);
    });

    socket.on("nuevaNotificacion", (noti: Notificacion) => {
      handleNotificacion(noti);
    });

    return () => {
      socket.disconnect();
    };
  }, [usuarioId, handleNotificacion]);

  return socketRef;
}
