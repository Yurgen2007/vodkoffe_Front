import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLotes, 
  getLoteById, 
  getResumenCostos,
  getUnidadesByLote,
  getEstadoLote,
  postLote, 
  putLote, 
  deleteLote,
  postRegistrarUnidadLote,
  postRegistrarMultiplesUnidadesLote
} from '../../axios/Lotes/getLote';
import { LoteCreate, LoteUpdate } from '../../types/Lote';

export const useLotes = () => {
  return useQuery({
    queryKey: ['lotes'],
    queryFn: getLotes,
  });
};

export const useLote = (id: number) => {
  return useQuery({
    queryKey: ['lotes', id],
    queryFn: () => getLoteById(id),
    enabled: !!id,
  });
};

export const useResumenCostos = (id: number) => {
  return useQuery({
    queryKey: ['lotes', id, 'resumen-costos'],
    queryFn: () => getResumenCostos(id),
    enabled: !!id,
  });
};

export const useUnidadesByLote = (loteId: number) => {
  return useQuery({
    queryKey: ['lotes', loteId, 'unidades'],
    queryFn: () => getUnidadesByLote(loteId),
    enabled: !!loteId,
  });
};

export const useEstadoLote = (loteId: number) => {
  return useQuery({
    queryKey: ['lotes', loteId, 'estado'],
    queryFn: () => getEstadoLote(loteId),
    enabled: !!loteId,
  });
};

export const useCreateLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoteCreate) => postLote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
  });
};

export const useUpdateLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LoteUpdate }) => putLote(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['lotes', variables.id] });
    },
  });
};

export const useDeleteLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteLote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
  });
};

export const useRegistrarUnidadLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (loteId: number) => postRegistrarUnidadLote(loteId),
    onSuccess: (_, loteId) => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['lotes', loteId, 'unidades'] });
      queryClient.invalidateQueries({ queryKey: ['lotes', loteId, 'estado'] });
    },
  });
};

export const useRegistrarMultiplesUnidadesLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ loteId, cantidad }: { loteId: number; cantidad: number }) => 
      postRegistrarMultiplesUnidadesLote(loteId, cantidad),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['lotes', variables.loteId, 'unidades'] });
      queryClient.invalidateQueries({ queryKey: ['lotes', variables.loteId, 'estado'] });
    },
  });
};
