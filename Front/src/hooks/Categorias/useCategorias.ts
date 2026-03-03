import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

import { Categoria, UpCategoria } from "@/types/Categorias";
import { getCategorias } from "../../axios/Categorias/getCategorias";
import { postCategorias } from "../../axios/Categorias/postCategorias";
import { UpdCategoria } from "../../axios/Categorias/putCategorias";
import { StateCategoria } from "../../axios/Categorias/putStateCategorias";
import { deleteCategoriaReal } from "../../axios/Categorias/deleteCategoriaReal";

export function useCategoria() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const addCategoriaMutation = useMutation({
    mutationFn: postCategorias,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },
    onError: (error) => {
      addToast({
        title: "Error al agregar categoría",
        description: error.message,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const getCategoriaById = (
    id: number,
    categorias: Categoria[] | undefined = data,
  ): Categoria | null => {
    return (
      categorias?.find((categoria) => categoria.idCategoria === id) || null
    );
  };

  const updateCategoriaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpCategoria }) => {
      const { idCategoria, ...resto } = data;

      return UpdCategoria(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateCategoria,

    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  // Mutación para eliminar categoría (usando delete real)
  const removeCategoriaMutation = useMutation({
    mutationFn: deleteCategoriaReal,

    onSuccess: () => {
      addToast({
        title: "Categoría eliminada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["categorias"],
      });
    },

    onError: (error) => {
      console.error("Error al eliminar:", error);
    },
  });

  const addCategoria = async (categoria: Categoria) => {
    return addCategoriaMutation.mutateAsync(categoria);
  };

  const updateCategoria = async (id: number, data: UpCategoria) => {
    return updateCategoriaMutation.mutateAsync({ id, data });
  };

  const changeState = async (idCategoria: number) => {
    return changeStateMutation.mutateAsync(idCategoria);
  };

  const removeCategoria = async (idCategoria: number) => {
    return removeCategoriaMutation.mutateAsync(idCategoria);
  };

  return {
    categorias: data,
    isLoading,
    isError,
    error,
    addCategoria,
    changeState,
    removeCategoria,
    getCategoriaById,
    updateCategoria,
  };
}
