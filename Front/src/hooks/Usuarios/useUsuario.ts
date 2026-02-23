import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

import { getUsuarios } from "@/axios/Usuarios/getUsuarios";
import { postUsuarios } from "@/axios/Usuarios/postUsuario";
import { StateUsuario } from "@/axios/Usuarios/putStateUsuario";
import { updateUsuario } from "@/axios/Usuarios/putUsuario";
import { User, putUser, postUser } from "@/types/Usuario";

export function useUsuario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsuarios,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addUserMutation = useMutation({
    mutationFn: postUsuarios,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.log("Error al cargar el usuario", error);
    },
  });

  const getUserById = (id: number, usersList: User[]): User | null => {
    if (!usersList) return null;

    return usersList.find((user) => user.idUsuario === id) || null;
  };

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: putUser }) => {
      const { idUsuario, ...resto } = data;

      return updateUsuario(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: StateUsuario,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addUser = async (usuario: postUser) => {
    return addUserMutation.mutateAsync(usuario);
  };

  const updateUser = async (id: number, data: putUser) => {
    return updateUserMutation.mutateAsync({ id, data });
  };

  const changeState = async (idUsuario: number) => {
    return changeStateMutation.mutateAsync(idUsuario);
  };

  return {
    users: data,
    isLoading,
    isError,
    error,
    addUser,
    changeState,
    getUserById,
    updateUser,
  };
}
