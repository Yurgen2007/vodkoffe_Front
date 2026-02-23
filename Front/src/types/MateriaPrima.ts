// Tipo completo de materia prima
export type MateriaPrima = {
  idMateriaPrima: number;
  nombre: string;
  descripcion?: string;
  costoUnitario: number;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
  fkUnidadMedida?: number | null;
  unidadMedida?: {
    idUnidad: number;
    nombre: string;
    abreviatura: string;
  } | null;
};

// Tipo para crear una materia prima
export type MateriaPrimaCreate = {
  nombre: string;
  descripcion?: string;
  costoUnitario?: number;
  estado?: boolean;
  fkUnidadMedida?: number;
};

// Tipo para actualizar una materia prima
export type MateriaPrimaUpdate = Partial<MateriaPrimaCreate>;
