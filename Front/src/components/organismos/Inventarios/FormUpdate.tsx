import { Input } from "@heroui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import { AxiosError } from "axios";

import Buton from "@/components/molecules/Button";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { InventarioUpdate, InventarioUpdateSchema } from "@/schemas/Inventario";
import { Inventario } from "@/types/Inventario";

type FormuProps = {
  inventarios: Inventario[];
  inventarioId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({
  inventarios,
  inventarioId,
  id,
  onclose,
}: FormuProps) => {
  const { updateInventario, getInventarioById } = useInventario();

  const foundInventario = getInventarioById(
    inventarioId,
    inventarios,
  ) as InventarioUpdate;

  if (!foundInventario) {
    return (
      <div className="p-4 text-red-500">Error: Inventario no encontrado</div>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InventarioUpdate>({
    resolver: zodResolver(InventarioUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idInventario: foundInventario.idInventario,
      nombre: foundInventario.nombre,
    },
  });

  const onSubmit: SubmitHandler<InventarioUpdate> = async (data) => {
    console.log("Enviando datos:", data);
    if (!data.idInventario) return;
    try {
      const inventarioData: Inventario = {
        idInventario: data.idInventario,
        nombre: data.nombre,
        estado: data.estado ?? true,
      };
      await updateInventario(data.idInventario, inventarioData);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Stock actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string | string[] }>;
      const backendMessage =
        err?.response?.data?.message || "Ocurrió un error inesperado";

      addToast({
        title: "Error al actualizar el inventario",
        description: backendMessage,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      console.error("Error al actualizar el área: ", error);
    }
  };

  console.log("Errores", errors);

  return (
    <form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        placeholder="Ingrese el nombre ..."
        {...register("nombre")}
        errorMessage={errors.nombre?.message}
        isInvalid={!!errors.nombre}
      />
      <Buton
        className="w-full rounded-xl"
        isLoading={isSubmitting}
        text="Guardar"
        type="submit"
      />
    </form>
  );
};
