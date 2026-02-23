import { Card, CardBody, Input, Spinner } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import LoginLogo from "../assets/login.png";

import { LoginSchema } from "@/schemas/User";
import Buton from "@/components/molecules/Button";
import useLogin from "@/hooks/Usuarios/useLogin";

type Props = {};

function Login({}: Props) {
  const { login, isError, error, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  // Efecto para remover el modo oscuro cuando se está en el Login
  useEffect(() => {
    // Guardar el tema actual
    const currentTheme = localStorage.getItem("theme");
    
    // Forzar modo claro temporalmente
    document.documentElement.classList.remove("dark");
    
    // Cleanup: restaurar el tema original al desmontar
    return () => {
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkTeal via-primary to-primaryLight relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 backdrop-blur-lg bg-gradient-to-tr from-darkTeal via-primary to-primaryLight"></div>

      <div className="w-full max-w-3xl flex items-center justify-center p-6">
        <div className="w-full bg-darkTeal/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-tealSoft/20 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-64 h-28 bg-tealSoft/20 rounded-full flex items-center justify-center mb-4">
              <img src={LoginLogo} alt="logo" className="w-68 h-auto object-contain" />
            </div>
            <h1 className="text-tealSoft text-xl font-semibold mb-4">INICIO DE SESIÓN</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(login)}>
            <Input
              autoComplete="off"
              label="Documento"
              placeholder="Documento de identidad"
              type="text"
              {...register("documento")}
              errorMessage={errors.documento?.message}
              isInvalid={!!errors.documento}
            />

            <Input
              {...register("password")}
              autoComplete="off"
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              label="Password"
              placeholder="Password"
              type="password"
            />

            {isError && <p className="text-red-300 text-center">{error}</p>}

            <div className="flex items-center justify-between text-sm text-tealSoft/90">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Remember me</span>
              </label>
              <a className="text-tealSoft/90 hover:underline" href="/forgotPass">Forgot Password?</a>
            </div>

            <div className="pt-4">
              <Buton className="w-full bg-gradient-to-r from-primary to-primaryLight text-white py-3 rounded-md shadow-md" type="submit">
                LOGIN
              </Buton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
