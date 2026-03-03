import { axiosAPI } from "../axiosAPI";

export const patchRolePermiso = async (permiso: number, rol: number) => {
  try {
    const { data } = await axiosAPI.patch(
      `rol-permiso/asign-permiso/${permiso}/${rol}`,
    );

    return data;
  } catch (error) {
    // Error en la petición
  }
};
