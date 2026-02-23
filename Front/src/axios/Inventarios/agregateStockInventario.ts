import { axiosAPI } from "../axiosAPI";

export type AgregateStockData = {
  idInventario?: number;
  fkSitio?: number;
  codigos?: string[];
};

export async function agregateStock(data: AgregateStockData): Promise<any> {
  const { idInventario, ...resto } = data;
  const res = await axiosAPI.post(`/inventarios/agregateStock`, resto);

  return res.data;
}
