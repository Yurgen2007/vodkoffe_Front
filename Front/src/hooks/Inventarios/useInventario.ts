import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AgregateStockData,
  agregateStock,
} from "@/axios/Inventarios/agregateStockInventario";
import { deleteInventario } from "@/axios/Inventarios/deleteInventario";
import { deleteInventarioReal } from "@/axios/Inventarios/deleteInventarioReal";
import { getInventario } from "@/axios/Inventarios/getInventario";
import {
  postInventario,
  InventarioPostData,
} from "@/axios/Inventarios/postInventario";
import { putInventario } from "@/axios/Inventarios/putInventario";
import { Inventario, InventarioConSitio } from "@/types/Inventario";

export function useInventario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<InventarioConSitio[]>({
    queryKey: ["inventarios"],
    queryFn: getInventario,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const addInventarioMutation = useMutation({
    mutationFn: (data: InventarioPostData) => postInventario(data),
    onSuccess: () => {
      addToast({
        title: "Inventario Creado",
        description: "El inventario se ha creado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.refetchQueries({
        queryKey: ["inventarios"],
      });
    },
    onError: (error) => {
      console.error("Error al crear inventario:", error);
      addToast({
        title: "Error",
        description: "No se pudo crear el inventario",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const getInventarioById = (
    id: number,
    inventarios: Inventario[] | undefined = data,
  ): Inventario | null => {
    return (
      inventarios?.find((inventario) => inventario.idInventario === id) || null
    );
  };

  const updateInventarioMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Inventario }) => {
      const { idInventario, ...resto } = data;

      return putInventario(id, resto as any);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["inventarios"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteInventario,

    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.refetchQueries({
        queryKey: ["inventarios"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const removeInventarioMutation = useMutation({
    mutationFn: deleteInventarioReal,

    onSuccess: () => {
      addToast({
        title: "Inventario eliminado",
        description: "El inventario se ha eliminado permanentemente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.refetchQueries({
        queryKey: ["inventarios"],
      });
    },

    onError: (error) => {
      console.error("Error al eliminar inventario:", error);
    },
  });

  const agregarStockMutation = useMutation({
    mutationFn: agregateStock,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["inventarios"] });
    },
    onError: (error) => {
      console.error("Error al agregar stock:", error);
    },
  });

  const addInventario = async (inventario: InventarioPostData) => {
    return addInventarioMutation.mutateAsync(inventario);
  };

  const updateInventario = async (id: number, data: Inventario) => {
    return updateInventarioMutation.mutateAsync({ id, data });
  };

  const changeState = async (idInventario: number) => {
    return changeStateMutation.mutateAsync(idInventario);
  };

  const removeInventario = async (idInventario: number) => {
    return removeInventarioMutation.mutateAsync(idInventario);
  };

  const agregarStockInventario = async (data: AgregateStockData) => {
    return agregarStockMutation.mutateAsync(data);
  };

  return {
    inventarios: data,
    isLoading,
    isError,
    error,
    addInventario,
    changeState,
    removeInventario,
    getInventarioById,
    updateInventario,
    agregarStockInventario,
  };
}
