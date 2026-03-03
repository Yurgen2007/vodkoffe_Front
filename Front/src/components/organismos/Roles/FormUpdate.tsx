import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/react";

import { RolUpdate, RolUpdateSchema } from "@/schemas/Rol";
import { useRol } from "@/hooks/Roles/useRol";
import Buton from "@/components/molecules/Button";

type Props = {
  roles: (RolUpdate & { idRol?: number })[];
  rolId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ roles, rolId, id, onclose }: Props) => {
  const { updateRol, getRolById } = useRol();

  const foundRol = getRolById(rolId, roles) as RolUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RolUpdate>({
    resolver: zodResolver(RolUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idRol: foundRol.idRol,
      nombre: foundRol.nombre,
    },
  });

  const onSubmit = async (data: RolUpdate) => {
    console.log(data);
    if (!data.idRol) return;
    try {
      await updateRol(data.idRol, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Rol actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el rol : ", error);
    }
  };

  console.log("Errores", errors);

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        {...register("nombre", { required: "El nombre es requerido" })}
        errorMessage={errors.nombre?.message}
        isInvalid={!!errors.nombre}
      />
      <Buton
        className="w-full rounded-xl"
        isLoading={isSubmitting}
        text="Guardar"
        type="submit"
      />
    </Form>
  );
};
