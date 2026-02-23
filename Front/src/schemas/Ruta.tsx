import { z } from "zod";

export const RutaSchema = z.object({
  idRuta: z.number().optional(),
  nombre: z
    .string({ required_error: "Nombre es requerido" })
    .min(1, "Mínimo 1 caracter"),
  descripcion: z.string().optional(),
  href: z.string({ required_error: "URL es requerida" }).min(1, "URL es requerida"),
  icono: z.string().optional(),
  listed: z.boolean().default(true),
  estado: z.boolean().optional(),
  fkModulo: z.number({ required_error: "Módulo requerido" }).optional(),
});

export type Ruta = z.infer<typeof RutaSchema>;

export const RutaUpdateSchema = z.object({
  idRuta: z.number(),
  nombre: z
    .string({ required_error: "Nombre es requerido" })
    .min(1, "Mínimo 1 caracter"),
  descripcion: z.string().optional(),
  href: z.string().optional(),
  icono: z.string().optional(),
  listed: z.boolean().optional(),
  estado: z.boolean().optional(),
});

export type RutaUpdate = z.infer<typeof RutaUpdateSchema>;
