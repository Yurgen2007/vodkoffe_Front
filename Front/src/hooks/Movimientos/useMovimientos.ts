import { addToast } from '@heroui/react';
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
      addToast({
        title: 'Movimiento creado correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-fisicas'] });
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al crear movimiento',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useUpdateMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MovimientoCreate> }) => 
      putMovimiento(id, data),
    onSuccess: () => {
      addToast({
        title: 'Movimiento actualizado correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al actualizar movimiento',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};

export const useDeleteMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteMovimiento(id),
    onSuccess: () => {
      addToast({
        title: 'Movimiento eliminado correctamente',
        color: 'success',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
    onError: (error) => {
      addToast({
        title: 'Error al eliminar movimiento',
        description: error.message,
        color: 'danger',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    },
  });
};
