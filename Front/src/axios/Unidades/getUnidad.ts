import { axiosAPI as api } from '../axiosAPI';

export const getUnidades = async () => {
  const response = await api.get('/unidades');
  return response.data;
};

export const getUnidadById = async (id: number) => {
  const response = await api.get(`/unidades/${id}`);
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

export const postUnidad = async (data: any) => {
  const response = await api.post('/unidades', data);
  return response.data;
};

export const postRegistrarUnidadLote = async (loteId: number, data: any) => {
  const response = await api.post(`/unidades/lote/${loteId}/registrar`, data);
  return response.data;
};

export const postRegistrarMultiplesUnidadesLote = async (loteId: number, data: any) => {
  const response = await api.post(`/unidades/lote/${loteId}/registrar-multiple`, data);
  return response.data;
};

export const putUnidad = async (id: number, data: any) => {
  const response = await api.patch(`/unidades/${id}`, data);
  return response.data;
};

export const deleteUnidad = async (id: number) => {
  const response = await api.delete(`/unidades/${id}`);
  return response.data;
};

// Verificar si un código de unidad ya existe
export const verificarCodigoUnidad = async (codigo: string) => {
  const response = await api.get(`/unidades/verificar-codigo?codigo=${encodeURIComponent(codigo)}`);
  return response.data;
};
