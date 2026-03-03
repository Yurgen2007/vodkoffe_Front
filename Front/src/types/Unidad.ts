// Estados válidos para una unidad física
export type EstadoUnidad = 'DISPONIBLE' | 'VENDIDA' | 'DEGUSTACION' | 'ALIANZA' | 'OTRO' | 'INACTIVO';

// Tipo completo de unidad
export type Unidad = {
  idUnidad: number;
  codigoUnidad: string;
  estado?: EstadoUnidad;
  createdAt: string;
  updatedAt: string;
  fkLote?: number | null;
  fkInventario?: number | null;
  fkCaracteristica?: number | null;
  fkUnidadMedida?: number | null;
  cantidad?: number;
  precioVenta?: number;
  lote?: {
    idLote: number;
    codigoLote: string;
    cantidadUnidades?: number;
  } | null;
  inventario?: {
    idInventario: number;
    nombre: string;
  } | null;
  caracteristica?: {
    idCaracteristica: number;
    nombre: string;
  } | null;
  unidadMedida?: {
    idUnidad: number;
    nombre: string;
  } | null;
};

// Tipo para crear una unidad
export type UnidadCreate = {
  codigoUnidad: string;
  fkLote?: string | number | undefined;
  fkInventario?: string | number | undefined;
  fkCaracteristica?: string | number | undefined;
  fkUnidadMedida?: string | number | undefined;
};

// Tipo para actualizar una unidad
export type UnidadUpdate = Partial<UnidadCreate> & { 
  estado?: EstadoUnidad;
};

export type RegistrarUnidadLote = {
  loteId: number;
};

export type RegistrarUnidadesLote = {
  loteId: number;
  unidades: Record<string, unknown>[];
};
