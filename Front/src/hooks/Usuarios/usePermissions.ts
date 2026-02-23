import { useAuth } from "@/providers/AuthProvider";

export default function usePermissions() {
  const { permissions } = useAuth();

  // Verificar que permissions sea un array válido
  const isValidPermissions = Array.isArray(permissions) && permissions.length > 0;

  if (!isValidPermissions) {
    console.warn("⚠️ usePermissions: permissions no válidos:", permissions);
  }

  const allPermissions = isValidPermissions
    ? permissions
        .flatMap((module: any) => module.rutas || [])
        .flatMap((route: any) => route.permisos || [])
    : [];

  function userHasPermission(id_permiso: number) {
    // Si no hay permisos, retornar true para desarrollo
    if (!isValidPermissions || allPermissions.length === 0) {
      console.warn("Permisos no cargados o vacíos:", permissions);
      return true; // Cambiar a true para desarrollo
    }

    const hasPermission = allPermissions.find((id: any) => id === id_permiso);

    if (!hasPermission) return false;

    return true;
  }

  return { userHasPermission };
}
