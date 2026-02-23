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
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
  });
};

export const useUpdateMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MateriaPrimaUpdate }) => putMateriaPrima(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas', variables.id] });
    },
  });
};

export const useDeleteMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteMateriaPrima(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
  });
};

export const useChangeStatusMateriaPrima = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => changeStatusMateriaPrima(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
  });
};
