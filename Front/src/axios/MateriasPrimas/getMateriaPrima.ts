import { axiosAPI as api } from '../axiosAPI';

export const getMateriasPrimas = async () => {
  const response = await api.get('/materias-primas');
  return response.data;
};

export const getMateriaPrimaById = async (id: number) => {
  const response = await api.get(`/materias-primas/${id}`);
  return response.data;
};

export const postMateriaPrima = async (data: any) => {
  const response = await api.post('/materias-primas', data);
  return response.data;
};

export const putMateriaPrima = async (id: number, data: any) => {
  const response = await api.patch(`/materias-primas/${id}`, data);
  return response.data;
};

export const deleteMateriaPrima = async (id: number) => {
  const response = await api.delete(`/materias-primas/${id}`);
  return response.data;
};

export const changeStatusMateriaPrima = async (id: number) => {
  const response = await api.patch(`/materias-primas/status/${id}`);
  return response.data;
};
