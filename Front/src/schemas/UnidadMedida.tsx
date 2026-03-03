import { z } from "zod";

export const UnidadMedidaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(70, { message: "No puede exceder 70 caracteres" }),
  estado: z.boolean(),
});

export type UnidadMedidaCreate = z.infer<typeof UnidadMedidaCreateSchema>;

export const UnidadMedidaUpdateSchema = UnidadMedidaCreateSchema.partial().extend({
  idUnidad: z.number().optional(),
});

export type UnidadMedidaUpdate = z.infer<typeof UnidadMedidaUpdateSchema>;
