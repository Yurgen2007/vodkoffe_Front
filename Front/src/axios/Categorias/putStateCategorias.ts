import { axiosAPI } from "../axiosAPI";

export const StateCategoria = async (id: number) => {
  const response = await axiosAPI.patch(`/categorias/status/${id}`);
  return response.data;
};
