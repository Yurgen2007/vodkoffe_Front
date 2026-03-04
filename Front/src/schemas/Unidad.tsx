import { z } from "zod";

// Estados válidos para una unidad
export const EstadoUnidadSchema = z.enum([
  "DISPONIBLE",
  "VENDIDA",
  "DEGUSTACION",
  "ALIANZA",
  "OTRO",
]);

export type EstadoUnidad = z.infer<typeof EstadoUnidadSchema>;

// Esquema para crear una unidad
const UnidadCreateBaseSchema = z.object({
  codigoUnidad: z
    .string()
    .min(1, { message: "El código de unidad es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" }),
  fkLote: z.union([z.string(), z.number()]).optional(),
  fkInventario: z.union([z.string(), z.number()]).optional(),
  fkCaracteristica: z.union([z.string(), z.number()]).optional(),
  fkUnidadMedida: z.union([z.string(), z.number()]).optional(),
});

export const UnidadCreateSchema = UnidadCreateBaseSchema;
export type UnidadCreate = z.infer<typeof UnidadCreateSchema> & {
  fkLote?: string | number | undefined;
  fkInventario?: string | number | undefined;
  fkCaracteristica?: string | number | undefined;
  fkUnidadMedida?: string | number | undefined;
};

// Esquema para actualizar una unidad
export const UnidadUpdateSchema = z.object({
  codigoUnidad: z
    .string()
    .min(1, { message: "El código de unidad es requerido" })
    .min(2, { message: "Debe contener como mínimo 2 caracteres" })
    .max(100, { message: "No puede exceder 100 caracteres" })
    .optional(),
  estado: EstadoUnidadSchema.optional(),
  fkLote: z.union([z.string(), z.number()]).optional().nullable(),
  fkInventario: z.union([z.string(), z.number()]).optional().nullable(),
  fkCaracteristica: z.union([z.string(), z.number()]).optional().nullable(),
  fkUnidadMedida: z.union([z.string(), z.number()]).optional().nullable(),
});

// Permitir string | number | null | undefined para las FK en update
export type UnidadUpdate = {
  codigoUnidad?: string;
  estado?: EstadoUnidad;
  fkLote?: string | number | null | undefined;
  fkInventario?: string | number | null | undefined;
  fkCaracteristica?: string | number | null | undefined;
  fkUnidadMedida?: string | number | null | undefined;
};

// Esquema para múltiples códigos (modo masivo)
export const UnidadMultipleSchema = z.object({
  codigosMultiples: z
    .string()
    .min(1, { message: "Ingrese al menos un código" })
    .refine(
      (val) => {
        const codigos = val.split(/[,\n]/).map((c) => c.trim()).filter(Boolean);
        return codigos.length > 0;
      },
      { message: "Ingrese al menos un código válido" }
    ),
});

export type UnidadMultiple = z.infer<typeof UnidadMultipleSchema>;
