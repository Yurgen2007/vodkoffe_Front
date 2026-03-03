import { useEffect, useState } from "react";

import { getPerfil } from "@/axios/Usuarios/getPerfil";
import { Perfil } from "@/types/Usuario";

export function usePerfil() {
  const [perfilInfo, setPerfilInfo] = useState<Perfil | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getProfile() {
      setIsLoading(true);
      try {
        const perfil = await getPerfil();

        setPerfilInfo(perfil);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Error desconocido"),
        );
      } finally {
        setIsLoading(false);
      }
    }
    getProfile();
  }, []);

  return { setPerfilInfo, perfilInfo, isLoading, error };
}
