import { axiosAPI as api } from '../axiosAPI';

export const getLotes = async () => {
  const response = await api.get('/lotes');
  return response.data;
};

export const getLoteById = async (id: number) => {
  const response = await api.get(`/lotes/${id}`);
  return response.data;
};

export const getResumenCostos = async (id: number) => {
  const response = await api.get(`/lotes/${id}/resumen-costos`);
  return response.data;
};

export const getUnidadesByLote = async (loteId: number) => {
  const response = await api.get(`/unidades/lote/${loteId}`);
  return response.data;
};

export const getEstadoLote = async (loteId: number) => {
  const response = await api.get(`/unidades/lote/${loteId}/estado`);
  return response.data;
};

export const postLote = async (data: any) => {
  const response = await api.post('/lotes', data);
  return response.data;
};

export const putLote = async (id: number, data: any) => {
  const response = await api.patch(`/lotes/${id}`, data);
  return response.data;
};

export const deleteLote = async (id: number) => {
  const response = await api.delete(`/lotes/${id}`);
  return response.data;
};

// Registrar unidad individual en un lote
export const postRegistrarUnidadLote = async (loteId: number) => {
  const response = await api.post(`/unidades/lote/${loteId}/registrar`, {});
  return response.data;
};

// Registrar múltiples unidades en un lote
export const postRegistrarMultiplesUnidadesLote = async (loteId: number, cantidad: number) => {
  const unidades = Array(cantidad).fill({});
  const response = await api.post(`/unidades/lote/${loteId}/registrar-multiple`, { unidades });
  return response.data;
};
