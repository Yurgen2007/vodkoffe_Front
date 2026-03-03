import { axiosAPI } from "../axiosAPI";

export const deleteCategoriaReal = async (id: number) => {
  const response = await axiosAPI.delete(`/categorias/${id}`);
  return response.data;
};
