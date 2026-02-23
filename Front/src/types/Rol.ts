export type Rol = {
  idRol?: number;
  nombre: string;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  asignarPermisos?: string;
};

export type RolCreate = {
  nombre: string;
  estado: boolean;
  idRol?: number;
};
