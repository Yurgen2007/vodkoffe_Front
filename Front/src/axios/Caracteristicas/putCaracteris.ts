import { axiosAPI } from "../axiosAPI";

import { Caracteristica } from "@/types/Caracteristica";

export async function updateCategoria(
  idCaracteristica: number,
  data: Caracteristica,
): Promise<any> {
  const response = await axiosAPI.patch(
    `caracteristicas/${idCaracteristica}`,
    data,
  );

  return response.data;
}
