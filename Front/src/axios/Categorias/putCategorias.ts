import { axiosAPI } from "../axiosAPI";

export const UpdCategoria = async (id: number, data: any) => {
  const response = await axiosAPI.patch(`/categorias/${id}`, data);
  return response.data;
};
