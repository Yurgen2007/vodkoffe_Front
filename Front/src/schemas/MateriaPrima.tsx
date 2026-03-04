import { z } from "zod";

export const MateriaPrimaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" }),
  descripcion: z.string().optional(),
  cantidad: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(1, { message: "La cantidad es requerida y debe ser al menos 1" }),
  costoUnitario: z
    .number({ invalid_type_error: "El costo debe ser un número" })
    .min(0.01, { message: "El costo unitario es requerido y debe ser mayor a 0" }),
  estado: z.boolean().default(true),
  fkUnidadMedida: z.number().optional().nullable(),
});

export type MateriaPrimaCreate = z.infer<typeof MateriaPrimaCreateSchema>;

export const MateriaPrimaUpdateSchema = z.object({
  idMateriaPrima: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" })
    .optional(),
  descripcion: z.string().optional(),
  cantidad: z
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .min(0, { message: "La cantidad no puede ser negativa" })
    .optional(),
  costoUnitario: z
    .number({ invalid_type_error: "El costo debe ser un número" })
    .min(0, { message: "El costo no puede ser negativo" })
    .optional(),
  estado: z.boolean().optional(),
  fkUnidadMedida: z.number().optional().nullable(),
});

export type MateriaPrimaUpdate = z.infer<typeof MateriaPrimaUpdateSchema>;
