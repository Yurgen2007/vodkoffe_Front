import { axiosAPI } from "../axiosAPI";

export const getCategorias = async () => {
  const response = await axiosAPI.get("/categorias");
  return response.data;
};
