import { z } from "zod";

// Tipos válidos para el movimiento
const TipoMovimientoSchema = z.enum(["VENTA", "NO_VENTA", "INVENTARIO"]);

// Schema para crear un movimiento
export const MovimientoCreateSchema = z.object({
  tipo: TipoMovimientoSchema,
  tipoInventario: z.enum(["entrada", "salida", "ajuste"]).optional(),
  cantidadVendida: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .default(0),
  cantidadDegustacion: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .default(0),
  cantidadAlianza: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .default(0),
  cantidadInventario: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .optional(),
  precioUnitario: z.union([
    z.number(),
    z.undefined()
  ]).optional(),
  descripcion: z.string().optional(),
  nombreCliente: z
    .string()
    .min(0)
    .optional()
    .or(z.literal('')),
  fechaMovimiento: z.string().optional(),
  fkLote: z
    .number({ required_error: "Debe seleccionar un lote" })
    .min(1, { message: "Debe seleccionar un lote" }),
  fkUsuario: z.number().optional(),
  fkUnidad: z.number().optional(),
}).refine(
  (data) => {
    // Validar que al menos una cantidad sea mayor a 0
    return (
      (data.cantidadVendida ?? 0) > 0 ||
      (data.cantidadDegustacion ?? 0) > 0 ||
      (data.cantidadAlianza ?? 0) > 0 ||
      (data.cantidadInventario ?? 0) > 0
    );
  },
  {
    message: "Debe ingresar al menos una cantidad mayor a 0",
    path: ["cantidadVendida"],
  }
);

export type MovimientoCreate = z.infer<typeof MovimientoCreateSchema>;

// Schema para actualizar un movimiento
export const MovimientoUpdateSchema = z.object({
  idMovimiento: z.number().optional(),
  tipo: TipoMovimientoSchema.optional(),
  tipoInventario: z.enum(["entrada", "salida", "ajuste"]).optional(),
  cantidadVendida: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .optional(),
  cantidadDegustacion: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .optional(),
  cantidadAlianza: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .optional(),
  cantidadInventario: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .optional(),
  precioUnitario: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(0, { message: "El precio no puede ser negativo" })
    .optional(),
  descripcion: z.string().optional(),
  nombreCliente: z.string().optional(),
  fkLote: z.number().optional(),
  fkUsuario: z.number().optional(),
  fkUnidad: z.number().optional(),
  estado: z.boolean().optional(),
});

export type MovimientoUpdate = z.infer<typeof MovimientoUpdateSchema>;
