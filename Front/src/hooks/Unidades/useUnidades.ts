import { addToast } from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUnidades, 
  getUnidadById, 
  getUnidadesByLote,
  getEstadoLote,
  postUnidad, 
  postRegistrarUnidadLote,
  postRegistrarMultiplesUnidadesLote,
  putUnidad, 
  deleteUnidad 
} from '../../axios/Unidades/getUnidad';
import { UnidadCreate, UnidadUpdate, RegistrarUnidadLote, RegistrarUnidadesLote } from '../../types/Unidad';

export const useUnidades = () => {
  return useQuery({
    queryKey: ['unidades-fisicas'],
    queryFn: async () => {
      const data = await getUnidades();
      // Verificar que los datos sean válidos
      if (!Array.isArray(data)) {
        return [];
      }
      return data;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const useUnidad = (id: number) => {
  return useQuery({
    queryKey: ['unidades-fisicas', id],
    queryFn: () => getUnidadById(id),
    enabled: !!id,
  });
};

export const useUnidadesByLote = (loteId: number) => {
  return useQuery({
    queryKey: ['unidades-fisicas', 'lote', loteId],
    queryFn: () => getUnidadesByLote(loteId),
    enabled: !!loteId,
  });
};

export const useEstadoLote = (loteId: number) => {
  return useQuery({
    queryKey: ['unidades-fisicas', 'lote', loteId, 'estado'],
    queryFn: () => getEstadoLote(loteId),
    enabled: !!loteId,
  });
};

export const useCreateUnidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UnidadCreate | UnidadCreate[]) => {
      // Si es un array, crear cada unidad
      if (Array.isArray(data)) {
        const results = [];
        for (const unidad of data) {
          const result = await postUnidad(unidad);
          results.push(result);
        }
        return results;
      }
      // Si es un solo objeto
      return postUnidad(data);
    },
    onSuccess: () => {
      addToast({
        title: 'Unidad(es) creada(s) correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
    onError: (error: any) => {
      // Extraer mensaje de error del servidor
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear unidad';
      addToast({
        title: 'Error al crear unidad',
        description: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
        color: 'danger',
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useRegistrarUnidadLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ loteId, data }: { loteId: number; data: RegistrarUnidadLote }) => 
      postRegistrarUnidadLote(loteId, data),
    onSuccess: () => {
      addToast({
        title: 'Unidad registrada en lote correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al registrar unidad en lote',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useRegistrarMultiplesUnidadesLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ loteId, data }: { loteId: number; data: RegistrarUnidadesLote }) => 
      postRegistrarMultiplesUnidadesLote(loteId, data),
    onSuccess: () => {
      addToast({
        title: 'Unidades registradas en lote correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al registrar unidades en lote',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useUpdateUnidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UnidadUpdate }) => putUnidad(id, data),
    onSuccess: () => {
      addToast({
        title: 'Unidad actualizada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al actualizar unidad',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useDeleteUnidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteUnidad(id),
    onSuccess: () => {
      addToast({
        title: 'Unidad eliminada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al eliminar unidad',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};
