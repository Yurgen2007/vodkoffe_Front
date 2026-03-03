import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Ruta, UpRuta } from "@/types/Ruta";
import { getRuta } from "@/axios/Rutas/getRuta";
import { postRuta } from "@/axios/Rutas/postRuta";
import { putRuta } from "@/axios/Rutas/putRuta";
import { StateRuta } from "@/axios/Rutas/putStateRuta";

export function useRuta() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Ruta[]>({
    queryKey: ["ruta"],
    queryFn: getRuta,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const addRutaMutation = useMutation({
    mutationFn: postRuta,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ruta"],
      });
    },
    onError: (error) => {
    },
  });

  const getRutaById = (
    id: number,
    ruta: Ruta[] | undefined = data,
  ): Ruta | null => {
    return ruta?.find((rutas) => rutas.idRuta === id) || null;
  };

  const updateRutaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpRuta }) =>
      putRuta(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ruta"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateRuta,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ruta"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addRuta = async (rutas: Ruta) => {
    return addRutaMutation.mutateAsync(rutas);
  };

  const updateRuta = async (id: number, data: UpRuta) => {
    return updateRutaMutation.mutateAsync({ id, data });
  };

  const changeState = async (idRuta: number) => {
    return changeStateMutation.mutateAsync(idRuta);
  };

  return {
    rutas: data,
    isLoading,
    isError,
    error,
    addRuta,
    changeState,
    getRutaById,
    updateRuta,
  };
}
