import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteUnidad } from "@/axios/UnidadesMedida/deleteUnidad";
import { deleteUnidadReal } from "@/axios/UnidadesMedida/deleteUnidadReal";
import { getUnidad } from "@/axios/UnidadesMedida/getUnidad";
import { postUnidad } from "@/axios/UnidadesMedida/postUnidad";
import { putUnidad } from "@/axios/UnidadesMedida/putUnidad";
import { UnidadMedidaCreate, UnidadMedidaUpdate } from "@/schemas/UnidadMedida";
import { UnidadMedida } from "@/types/UnidadMedida";

export function useUnidad() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<UnidadMedida[]>({
    queryKey: ["unidades"],
    queryFn: getUnidad,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const addUnidadMutation = useMutation({
    mutationFn: postUnidad,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el unidad", error);
    },
  });

  const getUnidadById = (id: number, unidadesList: UnidadMedida[]): UnidadMedida | null => {
    if (!unidadesList) return null;

    return unidadesList.find((unidad) => unidad.idUnidad === id) || null;
  };

  const updateUnidadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UnidadMedidaUpdate }) => {
      const { idUnidad, ...resto } = data as UnidadMedida;

      return putUnidad(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteUnidad,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const deleteRealMutation = useMutation({
    mutationFn: deleteUnidadReal,
    onSuccess: () => {
      addToast({
        title: "Unidad eliminada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al eliminar:", error);
    },
  });

  const addUnidad = async (unidad: UnidadMedidaCreate) => {
    return addUnidadMutation.mutateAsync(unidad);
  };

  const updateUnidad = async (id: number, data: UnidadMedidaUpdate) => {
    return updateUnidadMutation.mutateAsync({ id, data });
  };

  const changeState = async (idUnidad: number) => {
    return changeStateMutation.mutateAsync(idUnidad);
  };

  const deleteReal = async (idUnidad: number) => {
    return deleteRealMutation.mutateAsync(idUnidad);
  };

  return {
    unidades: data,
    isLoading,
    isError,
    error,
    addUnidad,
    changeState,
    getUnidadById,
    updateUnidad,
    deleteReal,
  };
}
