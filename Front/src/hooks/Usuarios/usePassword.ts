import { useState } from "react";

import { postForgotPassword } from "@/axios/Usuarios/postForgotPasswrod";
import { postResetPassword } from "@/axios/Usuarios/postResetPassword";
import { forgotPass, resetPass } from "@/schemas/User";

export default function usePassword() {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  async function forgotPassword(data: forgotPass) {
    try {
      await postForgotPassword(data);
    } catch (error) {
      console.error("No se pudo enviar el email", error);
      setIsError(true);
      setError("Error iniciando sesión");
      throw error;
    }
  }

  async function resetPassword(token: string, data: resetPass) {
    try {
      await postResetPassword(token, data);
    } catch (error) {
      console.error("No se pudo restablecer la contraseña", error);
      setIsError(true);
      setError("Error restableciendo la contraseña");
    }
  }

  return { forgotPassword, resetPassword, isError, error };
}
