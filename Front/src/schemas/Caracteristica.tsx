import { z } from "zod";

export const CaracteristicaCreateSchema = z.object({
  idCaracteristica: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(2, "Mínimo 2 caracteres"),
  descripcion: z.string().optional(),
  estado: z.boolean({ required_error: "Estado es requerido" }),
});

export type CaracteristicaCreate = z.infer<typeof CaracteristicaCreateSchema>;

export const CaracteristicaUpdateSchema = z.object({
  idCaracteristica: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(2, "Mínimo 2 caracteres")
    .optional(),
  descripcion: z.string().optional(),
  estado: z.boolean().optional(),
});

export type CaracteristicaUpdate = z.infer<typeof CaracteristicaUpdateSchema>;
