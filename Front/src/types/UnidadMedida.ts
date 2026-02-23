export type UnidadMedida = {
  idUnidad: number;
  nombre: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UnidadMedidaCreate = {
  nombre: string;
  estado: boolean;
};
