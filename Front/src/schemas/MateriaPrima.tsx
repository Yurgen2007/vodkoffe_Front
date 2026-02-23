import { z } from "zod";

export const MateriaPrimaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" }),
  descripcion: z.string().optional(),
  costoUnitario: z
    .number({ invalid_type_error: "El costo debe ser un número" })
    .min(0, { message: "El costo debe ser mayor o igual a 0" }),
  estado: z.boolean().default(true),
  fkUnidadMedida: z.number().optional().nullable(),
});

export type MateriaPrimaCreate = z.infer<typeof MateriaPrimaCreateSchema>;

export const MateriaPrimaUpdateSchema = MateriaPrimaCreateSchema.partial().extend({
  idMateriaPrima: z.number().optional(),
});

export type MateriaPrimaUpdate = z.infer<typeof MateriaPrimaUpdateSchema>;
