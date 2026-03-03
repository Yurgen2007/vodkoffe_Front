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
      addToast({
        title: 'Unidad de medida creada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error al crear unidad de medida',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
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
      addToast({
        title: 'Unidad de medida actualizada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      addToast({
        title: 'Error al actualizar unidad de medida',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteUnidad,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con éxito",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      addToast({
        title: 'Error al cambiar estado',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const deleteRealMutation = useMutation({
    mutationFn: deleteUnidadReal,
    onSuccess: () => {
      addToast({
        title: "Unidad eliminada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      addToast({
        title: 'Error al eliminar unidad de medida',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
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
