import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

/**
 * Hook genérico para mutaciones
 * Elimina código duplicado en handlers onSuccess/onError
 */
interface UseGenericMutationOptions<T> {
  mutationFn: (data: T) => Promise<any>;
  queryKey: string[];
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export const useGenericMutation = <T>({
  mutationFn,
  queryKey,
  successMessage = "Operación realizada correctamente",
  errorMessage = "Error al realizar la operación",
  onSuccess,
}: UseGenericMutationOptions<T>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: successMessage,
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.();
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || errorMessage,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

/**
 * Hook genérico para eliminar registros
 */
interface UseGenericDeleteOptions {
  queryKey: string[];
  successMessage?: string;
  errorMessage?: string;
}

export const useGenericDelete = ({
  mutationFn,
  queryKey,
  successMessage = "Registro eliminado correctamente",
  errorMessage = "Error al eliminar el registro",
}: {
  mutationFn: (id: number) => Promise<any>;
} & UseGenericDeleteOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: successMessage,
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || errorMessage,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

/**
 * Hook genérico para cambiar estado (activar/desactivar)
 */
interface UseGenericChangeStateOptions {
  queryKey: string[];
  successMessage?: string;
  errorMessage?: string;
}

export const useGenericChangeState = ({
  mutationFn,
  queryKey,
  successMessage = "Estado actualizado correctamente",
  errorMessage = "Error al actualizar el estado",
}: {
  mutationFn: (id: number) => Promise<any>;
} & UseGenericChangeStateOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: successMessage,
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error?.response?.data?.message || errorMessage,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};
