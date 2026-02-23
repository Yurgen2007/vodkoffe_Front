import { z } from "zod";

export const PermisoUpdateSchema = z.object({
  idPermiso: z.number().optional(),
  permiso: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Debe contener como mínimo 3 caracteres" }),
  estado: z.boolean().optional(),
  fkRuta: z.number().optional(),
});

export type PermisoUpdate = z.infer<typeof PermisoUpdateSchema>;

export const PermisoCreateSchema = z.object({
  permiso: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Debe contener como mínimo 3 caracteres" }),
  estado: z.boolean().default(true),
  fkRuta: z.number({ required_error: "Ruta es requerida" }),
});
export type PermisoCreate = z.infer<typeof PermisoCreateSchema>;
