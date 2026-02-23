export type Lote = {
  idLote: number;
  codigoLote: string;
  cantidadUnidades: number;
  fechaProduccion: string;
  fechaVencimiento: string;
  costoUnitario: number;
  costoTotal: number;
  costoMateriasPrimas: number;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
  unidades?: any[];
  materiasPrimas?: any[];
  movimientos?: any[];
};

export type LoteCreate = {
  codigoLote: string;
  fechaProduccion: string;
  fechaVencimiento?: string;
  costoUnitario: number;
  materiasPrimas?: {
    idMateriaPrima: number;
    cantidad: number;
    costoUnitario: number;
  }[];
};

export type LoteUpdate = Partial<LoteCreate> & { estado?: boolean };
