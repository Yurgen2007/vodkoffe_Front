export type CodigoInventario = {
  idCodigoInventario?: number;
  codigo?: string;
  uso?: boolean;
  baja?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fkInventario?: {
    idInventario?: number;
  };
};
