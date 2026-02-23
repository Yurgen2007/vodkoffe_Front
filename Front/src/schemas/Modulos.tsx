import { z } from "zod";

export const ModuloSchema = z.object({
  idModulo: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(1, "Mínimo 1 caracter"),
  descripcion: z.string().optional(),
  href: z.string().optional(),
  icono: z.string({ required_error: "Icono es requerido" }).min(1, "Icono es requerido"),
  estado: z.boolean().optional(),
});

export type Modulo = z.infer<typeof ModuloSchema>;

export const ModuloUpdateSchema = z.object({
  idModulo: z.number(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(1, "Mínimo 1 caracter"),
  descripcion: z.string().optional(),
  href: z.string().optional(),
  icono: z.string().optional(),
  estado: z.boolean().optional(),
});

export type ModuloUpdate = z.infer<typeof ModuloUpdateSchema>;
