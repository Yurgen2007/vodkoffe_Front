import { axiosAPI as api } from '../axiosAPI';
import { Movimiento, MovimientoCreate, ReporteMensual } from '../../types/Movimiento';

export const getMovimientos = async (): Promise<Movimiento[]> => {
  const response = await api.get('/movimientos');
  return response.data;
};

export const getMovimientoById = async (id: number): Promise<Movimiento> => {
  const response = await api.get(`/movimientos/${id}`);
  return response.data;
};

export const getReporteMensual = async (mes: number, anio: number): Promise<ReporteMensual> => {
  const response = await api.get(`/movimientos/reporte-mensual?mes=${mes}&anio=${anio}`);
  return response.data;
};

export const getReportePorProducto = async (productoId: number, mes?: number, anio?: number): Promise<Movimiento[]> => {
  let url = `/movimientos/reporte-producto/${productoId}`;
  const params = [];
  if (mes) params.push(`mes=${mes}`);
  if (anio) params.push(`anio=${anio}`);
  if (params.length > 0) url += `?${params.join('&')}`;
    
  const response = await api.get(url);
  return response.data;
};

export const postMovimiento = async (data: MovimientoCreate): Promise<Movimiento> => {
  const response = await api.post('/movimientos', data);
  return response.data;
};

export const putMovimiento = async (id: number, data: Partial<MovimientoCreate>): Promise<Movimiento> => {
  const response = await api.put(`/movimientos/${id}`, data);
  return response.data;
};

export const deleteMovimiento = async (id: number): Promise<void> => {
  await api.delete(`/movimientos/${id}`);
};
