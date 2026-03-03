import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getPermiso } from "@/axios/Permisos/getPermiso";
import { postPermiso } from "@/axios/Permisos/postPermiso";
import { putPermiso } from "@/axios/Permisos/putPermiso";
import { Permisos } from "@/types/permisos";

export function usePermisos() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Permisos[]>({
    queryKey: ["permisos"],
    queryFn: getPermiso,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addPermisosMutation = useMutation({
    mutationFn: postPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permisos"],
      });
    },
    onError: (error) => {
    },
  });

  const getPermisosById = (
    id: number,
    permisos: Permisos[] | undefined = data,
  ): Permisos | null => {
    return permisos?.find((permiso) => permiso.idPermiso === id) || null;
  };

  const updatePermisoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Permisos }) =>
      putPermiso(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permisos"],
      });
    },
    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const addPermiso = async (permisos: Permisos) => {
    return addPermisosMutation.mutateAsync(permisos);
  };

  const updatePermisos = async (id: number, data: Permisos) => {
    return updatePermisoMutation.mutateAsync({ id, data });
  };

  return {
    permiso: data,
    isLoading,
    isError,
    error,
    addPermiso,
    getPermisosById,
    updatePermisos,
  };
}
