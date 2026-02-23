import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import { verificarInventario } from "@/axios/Notificaciones/verificarInventario";
import { postLogin } from "@/axios/Usuarios/postLogin";
import { getPerfil } from "@/axios/Usuarios/getPerfil";
import { useAuth } from "@/providers/AuthProvider";
import { Credenciales } from "@/schemas/User";

const cookies = new Cookies();

export default function useLogin() {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setAuthenticated, setIdUser, setPermissions, setNombre, setPerfil } = useAuth();

  const navigate = useNavigate();

  async function login(data: Credenciales) {
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await postLogin(data);

      console.log(response);

      const token = response.access_token;
      const permissions = response.modules;

      console.log("📦 Datos recibidos del backend:", response);
      console.log("📦 Permissions del backend:", permissions);

      cookies.set("token", token, { path: "/" });
      // Guardar permisos como string JSON para asegurar que se guarden correctamente
      cookies.set("permissions", JSON.stringify(permissions), { path: "/" });
      //Auth
      const { idUsuario }: { idUsuario: number } = jwtDecode(token);

      setAuthenticated(true);
      setIdUser(idUsuario);

      // Cargar perfil del usuario
      const perfilData = await getPerfil();
      setNombre(perfilData.nombre);
      setPerfil(perfilData.perfil);

      await verificarInventario(idUsuario);
      //Error handling
      setIsError(false);
      setError(undefined);
      setPermissions(permissions);
      //Redirection
      navigate("/");
    } catch (error: any) {
      const errorMessage = error.message;

      console.log(errorMessage);
      setIsError(true);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      cookies.remove("token");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return { login, isError, error, logout, isLoading };
}
