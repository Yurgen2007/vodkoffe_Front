import { z } from "zod";

export const RolUpdateSchema = z.object({
  idRol: z.number(),
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Debe contener como mínimo 3 caracteres" }),
  estado: z.boolean().optional(),
});

export type RolUpdate = z.infer<typeof RolUpdateSchema>;

export const RolCreateSchema = z.object({
  idRol: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Debe contener como mínimo 3 caracteres" }),
  estado: z.boolean({ required_error: "Estado es requerido" }).default(true),
});
export type RolCreate = z.infer<typeof RolCreateSchema>;
