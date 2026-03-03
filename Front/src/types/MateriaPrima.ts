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
export type MateriaPrimaUpdate = {
  nombre?: string;
  descripcion?: string;
  costoUnitario?: number;
  estado?: boolean;
  fkUnidadMedida?: number;
};
