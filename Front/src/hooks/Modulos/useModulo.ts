import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Modulo, UpModulo } from "@/types/Modulo";
import { getModulo } from "@/axios/Modulos/getModulos";
import { postModulo } from "@/axios/Modulos/postModulo";
import { putModulo } from "@/axios/Modulos/putModulo";
import { StateModulo } from "@/axios/Modulos/putStateModulo";

export function useModulo() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Modulo[]>({
    queryKey: ["modulos"],
    queryFn: getModulo,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const addModuloMutation = useMutation({
    mutationFn: postModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["modulos"],
      });
    },
    onError: (error) => {
    },
  });

  const getModuloById = (
    id: number,
    modulos: Modulo[] | undefined = data,
  ): Modulo | null => {
    return modulos?.find((modulo) => modulo.idModulo === id) || null;
  };

  const updateModuloMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpModulo }) =>
      putModulo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["modulos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["modulos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addModulo = async (modulo: Modulo) => {
    return addModuloMutation.mutateAsync(modulo);
  };

  const updateModulo = async (id: number, data: UpModulo) => {
    return updateModuloMutation.mutateAsync({ id, data });
  };

  const changeState = async (idModulo: number) => {
    return changeStateMutation.mutateAsync(idModulo);
  };

  return {
    modulos: data,
    isLoading,
    isError,
    error,
    addModulo,
    changeState,
    getModuloById,
    updateModulo,
  };
}
