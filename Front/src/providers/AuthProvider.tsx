import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

import { getRefetchPermisos } from "@/axios/Usuarios/getRefetchPermisos";
import { getPerfil } from "@/axios/Usuarios/getPerfil";

type Auth = {
  authenticated: boolean | undefined;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  nombre: string | undefined;
  setNombre: React.Dispatch<React.SetStateAction<string | undefined>>;
  perfil: string | undefined;
  setPerfil: React.Dispatch<React.SetStateAction<string | undefined>>;
  idUsuario: number | undefined;
  setIdUser: React.Dispatch<React.SetStateAction<number | undefined>>;
  idRol: number | undefined;
  setIdRol: React.Dispatch<React.SetStateAction<number | undefined>>;
  permissions: any[];
  setPermissions: React.Dispatch<React.SetStateAction<any[]>>;
};

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext) as Auth;

// Filtrar submodulos por módulo
const filterSubmodules = (modulo: any) => {
  if (!modulo.rutas) return modulo;
  
  const moduloNombre = modulo.nombre?.toLowerCase();
  
  let filteredRutas = modulo.rutas;
  
  if (moduloNombre === 'admin') {
    // Mostrar: Usuarios, Roles, Acceso, Ingresos/Egresos
    const allowedSubmodules = [
      'usuarios',
      'roles',
      'acceso',
      'ingresos/egresos'
    ];
    filteredRutas = modulo.rutas.filter((ruta: any) => 
      allowedSubmodules.includes(ruta.nombre?.toLowerCase())
    );
  }
  
  if (moduloNombre === 'bodega') {
    // Mostrar solo: unidades, inventarios, lotes, materias primas, movimientos
    const allowedSubmodules = [
      'unidades',
      'inventarios',
      'lotes',
      'materias primas',
      'movimientos'
    ];
    filteredRutas = modulo.rutas.filter((ruta: any) => 
      allowedSubmodules.includes(ruta.nombre?.toLowerCase())
    );
  }
  
  return {
    ...modulo,
    rutas: filteredRutas
  };
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(
    undefined,
  );
  const [nombre, setNombre] = useState<string | undefined>(undefined);
  const [perfil, setPerfil] = useState<string | undefined>(undefined);
  const [idUsuario, setIdUser] = useState<number | undefined>(undefined);
  const [idRol, setIdRol] = useState<number | undefined>(undefined);
  const [permissions, setPermissions] = useState<any[]>([]);

  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    let permissions = cookies.get("permissions");

    // Parsear permissions si es un string JSON
    if (typeof permissions === 'string') {
      try {
        permissions = JSON.parse(permissions);
      } catch (e) {
        console.error("Error parsing permissions:", e);
        permissions = [];
      }
    }

    if (token) {
      const {
        idUsuario,
      }: {
        idUsuario: number;
      } = jwtDecode(token);

      setIdUser(idUsuario);
      setAuthenticated(true);
    }
    if (permissions && Array.isArray(permissions)) {
      console.log("✅ Permissions cargados desde cookie:", permissions);
      setPermissions(permissions);
    } else {
      console.warn("⚠️ Permissions NO son un array o están vacíos:", permissions);
    }

    const loadPerfil = async () => {
      try {
        const perfilData = await getPerfil();
        setNombre(perfilData.nombre);
        setPerfil(perfilData.perfil);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    if (token) {
      loadPerfil();
    }

    const reloadPermisos = async () => {
      const token = cookies.get("token");

      if (!token) return;

      try {
        const data = await getRefetchPermisos();
        
        console.log("📦 Datos de getRefetchPermisos:", data);
        
        // Verificar que data sea un array antes de procesar
        if (!data || !Array.isArray(data)) {
          console.warn("Data de permisos no es un array:", data);
          return;
        }

        // Filtrar submodulos por módulo
        const filteredData = data.map((modulo: any) => filterSubmodules(modulo));
        
        console.log("✅ Permissions recargados correctamente:", filteredData);
        setPermissions(filteredData);
      } catch (error) {
        console.error("Error al recargar permisos:", error);
      }
    };

    if (token) {
      reloadPermisos();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        nombre,
        setNombre,
        perfil,
        setPerfil,
        setIdUser,
        idUsuario,
        idRol,
        setIdRol,
        permissions,
        setPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
