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
      console.log('Datos recibidos en mutate:', data);
      console.log('Es array?:', Array.isArray(data));
      // Si es un array, crear cada unidad
      if (Array.isArray(data)) {
        console.log('Cantidad de unidades a crear:', data.length);
        const results = [];
        for (const unidad of data) {
          console.log('Creando unidad:', unidad);
          const result = await postUnidad(unidad);
          results.push(result);
        }
        return results;
      }
      // Si es un solo objeto
      console.log('Creando una sola unidad:', data);
      return postUnidad(data);
    },
    onSettled: () => {
      // Forzar refetch después de que la mutación termine (éxito o error)
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
  });
};

export const useRegistrarUnidadLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ loteId, data }: { loteId: number; data: RegistrarUnidadLote }) => 
      postRegistrarUnidadLote(loteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
    },
  });
};

export const useRegistrarMultiplesUnidadesLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ loteId, data }: { loteId: number; data: RegistrarUnidadesLote }) => 
      postRegistrarMultiplesUnidadesLote(loteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
    },
  });
};

export const useUpdateUnidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UnidadUpdate }) => putUnidad(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
  });
};

export const useDeleteUnidad = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteUnidad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
  });
};
