import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMovimientos, 
  getMovimientoById, 
  getReporteMensual,
  getReportePorProducto,
  postMovimiento, 
  putMovimiento, 
  deleteMovimiento 
} from '../../axios/Movimientos/getMovimiento';
import { MovimientoCreate, Movimiento } from '../../types/Movimiento';

export const useMovimientos = () => {
  return useQuery({
    queryKey: ['movimientos'],
    queryFn: getMovimientos,
  });
};

export const useMovimiento = (id: number) => {
  return useQuery({
    queryKey: ['movimientos', id],
    queryFn: () => getMovimientoById(id),
    enabled: !!id,
  });
};

export const useReporteMensual = (mes: number, anio: number) => {
  return useQuery({
    queryKey: ['movimientos', 'reporte-mensual', mes, anio],
    queryFn: () => getReporteMensual(mes, anio),
    enabled: !!mes && !!anio,
  });
};

export const useReportePorProducto = (productoId: number, mes?: number, anio?: number) => {
  return useQuery({
    queryKey: ['movimientos', 'reporte-producto', productoId, mes, anio],
    queryFn: () => getReportePorProducto(productoId, mes, anio),
    enabled: !!productoId,
  });
};

export const useCreateMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MovimientoCreate) => postMovimiento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
};

export const useUpdateMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MovimientoCreate> }) => 
      putMovimiento(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos', variables.id] });
    },
  });
};

export const useDeleteMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteMovimiento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });
};
