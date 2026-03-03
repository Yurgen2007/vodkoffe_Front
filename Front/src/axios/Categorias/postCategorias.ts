import { axiosAPI } from "../axiosAPI";

export const postCategorias = async (data: any) => {
  const response = await axiosAPI.post("/categorias", data);
  return response.data;
};
