export type CodigoInventario = {
  idCodigoInventario: number;
  codigo: string;
  uso: boolean;
  baja?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fkInventario?: {
    idInventario?: number;
    nombre?: string;
  };
};

export type Inventario = {
  idInventario: number;
  nombre: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type InventarioConSitio = Inventario;
