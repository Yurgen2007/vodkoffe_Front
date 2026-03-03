import { addToast } from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMateriasPrimas, 
  getMateriaPrimaById, 
  postMateriaPrima, 
  putMateriaPrima, 
  deleteMateriaPrima,
  changeStatusMateriaPrima
} from '../../axios/MateriasPrimas/getMateriaPrima';
import { MateriaPrimaCreate, MateriaPrimaUpdate } from '../../types/MateriaPrima';

export const useMateriasPrimas = () => {
  return useQuery({
    queryKey: ['materiasPrimas'],
    queryFn: getMateriasPrimas,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useMateriaPrima = (id: number) => {
  return useQuery({
    queryKey: ['materiasPrimas', id],
    queryFn: () => getMateriaPrimaById(id),
    enabled: !!id,
  });
};

export const useCreateMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MateriaPrimaCreate) => postMateriaPrima(data),
    onSuccess: () => {
      addToast({
        title: 'Materia prima creada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al crear materia prima',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useUpdateMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MateriaPrimaUpdate }) => putMateriaPrima(id, data),
    onSuccess: () => {
      addToast({
        title: 'Materia prima actualizada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al actualizar materia prima',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useDeleteMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteMateriaPrima(id),
    onSuccess: () => {
      addToast({
        title: 'Materia prima eliminada correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al eliminar materia prima',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useChangeStatusMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => changeStatusMateriaPrima(id),
    onSuccess: () => {
      addToast({
        title: 'Estado actualizado correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.refetchQueries({ queryKey: ['materiasPrimas'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al cambiar estado',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};
