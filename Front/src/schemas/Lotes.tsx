import { z } from "zod";

// Schema para crear un lote
export const LoteCreateSchema = z.object({
  codigoLote: z
    .string()
    .min(1, { message: "El código del lote es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" }),
  cantidadUnidades: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(1, { message: "La cantidad mínima es 1" })
    .optional(),
  fechaProduccion: z
    .string()
    .min(1, { message: "La fecha de producción es requerida" }),
  fechaVencimiento: z.string().optional(),
  costoUnitario: z
    .number({ invalid_type_error: "El costo debe ser un número" })
    .min(0.01, { message: "El costo unitario es requerido y debe ser mayor a 0" }),
});

export type LoteCreate = z.infer<typeof LoteCreateSchema>;

// Schema para actualizar un lote
export const LoteUpdateSchema = z.object({
  idLote: z.number().optional(),
  codigoLote: z
    .string()
    .min(1, { message: "El código del lote es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" })
    .optional(),
  cantidadUnidades: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(1, { message: "La cantidad mínima es 1" })
    .optional(),
  fechaProduccion: z.string().optional(),
  fechaVencimiento: z.string().optional().nullable(),
  costoUnitario: z
    .number({ invalid_type_error: "El costo debe ser un número" })
    .min(0, { message: "El costo debe ser mayor o igual a 0" })
    .optional(),
  estado: z.boolean().optional(),
});

export type LoteUpdate = z.infer<typeof LoteUpdateSchema>;
