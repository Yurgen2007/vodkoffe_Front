import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getCaracteristicas } from "@/axios/Caracteristicas/getCaracteris";
import { postCaracteristica } from "@/axios/Caracteristicas/postCaracteris";
import { updateCategoria } from "@/axios/Caracteristicas/putCaracteris";
import { deleteCaracteristica } from "@/axios/Caracteristicas/deleteCaracteris";
import { Caracteristica } from "@/types/Caracteristica";

export function useCaracteristica() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Caracteristica[]>({
    queryKey: ["caracteristicas"],
    queryFn: getCaracteristicas,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const addCaracteristicaMutation = useMutation({
    mutationFn: postCaracteristica,
    onSuccess: () => {
      addToast({
        title: 'Característica creada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["caracteristicas"],
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error al crear característica',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const getCaracteristicaById = (
    id: number,
    caracteristicas: Caracteristica[] | undefined = data,
  ): Caracteristica | null => {
    return (
      caracteristicas?.find(
        (caracteristica) => caracteristica.idCaracteristica === id,
      ) || null
    );
  };

  const updateCaracteristicaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Caracteristica }) => {
      const { idCaracteristica, ...resto } = data;

      return updateCategoria(id, resto);
    },
    onSuccess: () => {
      addToast({
        title: 'Característica actualizada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["caracteristicas"],
      });
    },

    onError: (error) => {
      addToast({
        title: 'Error al actualizar característica',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const addCaracteristica = async (caracteristica: Caracteristica) => {
    return addCaracteristicaMutation.mutateAsync(caracteristica);
  };

  const updateCaracteristica = async (id: number, data: Caracteristica) => {
    return updateCaracteristicaMutation.mutateAsync({ id, data });
  };

  const deleteCaracteristicaMutation = useMutation({
    mutationFn: deleteCaracteristica,
    onSuccess: () => {
      addToast({
        title: 'Característica eliminada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["caracteristicas"],
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error al eliminar característica',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const removeCaracteristica = async (id: number) => {
    return deleteCaracteristicaMutation.mutateAsync(id);
  };

  return {
    caracteristicas: data,
    isLoading,
    isError,
    error,
    addCaracteristica,
    getCaracteristicaById,
    updateCaracteristica,
    removeCaracteristica,
  };
}
