export type User = {
  idUsuario?: number;
  documento?: number;
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  correo: string;
  estado?: boolean;
  cargo?: string;
  password?: string;
  fkRol?: number | {
    idRol?: number;
    nombre?: string;
  };
  // Campos de configuracion de correo
  serviceMail?: string;
  mailUser?: string;
  mailPassword?: string;
  perfil?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Perfil = {
  documento: number;
  edad: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  perfil: string;
  fkRol: {
    nombre: string;
  };
};
export type UpPerfil = {
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  correo: string;
  password: string;
};

export type postUser = {
  documento: number;
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  correo: string;
  estado?: boolean;
  cargo?: string;
  password?: string;
  fkRol?: number;
};

export type putUser = {
  idUsuario?: number;
  nombre: string;
  apellido: string | null;
  edad: number | null;
  telefono: string | null;
  correo: string | null;
  cargo?: string;
  fkRol?: number;
  estado?: boolean;
  // Campos de configuracion de correo
  serviceMail?: string;
  mailUser?: string;
  mailPassword?: string;
};

export type LoginCrede = {
  documento: string;
  password: string;
};

export type LoginRes = {
  access_token: string;
  modules: any[];
};

export type resetPassword = {
  password: string;
  confirmPassword: string;
};

export type forgotPassword = {
  correo: string;
};
