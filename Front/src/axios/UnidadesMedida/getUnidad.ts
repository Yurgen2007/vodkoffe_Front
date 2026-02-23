import { axiosAPI } from "../axiosAPI";

import { UnidadMedida } from "@/types/UnidadMedida";

export const getUnidad = async (): Promise<UnidadMedida[]> => {
  const res = await axiosAPI.get(`unidades-medida`);

  return res.data;
};
