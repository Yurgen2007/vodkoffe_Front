export type Movimiento = {
  idMovimiento: number;
  tipo: string; // 'VENTA', 'NO_VENTA', 'INVENTARIO'
  tipoNoVenta?: string; // 'DEGUSTACION', 'ALIANZA', 'OTRO'
  tipoInventario?: string; // 'entrada', 'salida', 'ajuste'
  cantidadVendida: number;
  cantidadDegustacion: number;
  cantidadAlianza: number;
  cantidadOtro: number;
  cantidadInventario?: number;
  cantidadTotal: number;
  precioUnitario: number;
  precioTotal: number;
  descripcion?: string;
  nombreCliente?: string; // Nombre del cliente al que se le vende
  fechaMovimiento: string;
  createdAt: string;
  updatedAt: string;
  estado?: boolean;
  fkLote?: number;
  fkUsuario?: number;
  fkUnidad?: number;
  lote?: any;
  unidad?: any;
  usuario?: any;
};

export type MovimientoCreate = {
  tipo: 'VENTA' | 'NO_VENTA' | 'INVENTARIO';
  tipoNoVenta?: 'DEGUSTACION' | 'ALIANZA' | 'OTRO';
  tipoInventario?: 'entrada' | 'salida' | 'ajuste';
  cantidadVendida: number;
  cantidadDegustacion: number;
  cantidadAlianza: number;
  cantidadOtro: number;
  cantidadInventario?: number;
  precioUnitario: number;
  descripcion?: string;
  nombreCliente?: string; // Nombre del cliente al que se le vende
  fechaMovimiento: string;
  fkLote: number;
  fkUsuario?: number;
  fkUnidad?: number;
};

export type MovimientoUpdate = Partial<MovimientoCreate>;

export type ReporteMensual = {
  mes: number;
  anio: number;
  totalEntradas: number;
  totalSalidas: number;
  movimientos: Movimiento[];
};
