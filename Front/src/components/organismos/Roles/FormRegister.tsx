import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";

import { RolCreate } from "@/types/Rol";

type FormularioProps = {
  addData: (rol: RolCreate) => Promise<any>;
  onClose: () => void;
  id: string;
};

export default function FormularioRoles({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RolCreate>({
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const onSubmit = async (data: RolCreate) => {
    try {
      console.log("Datos enviados:", data);
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Rol agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        type="text"
        {...register("nombre", { required: "El nombre es requerido" })}
        errorMessage={errors.nombre?.message}
        isInvalid={!!errors.nombre}
      />
      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            selectedKeys={[field.value ? "true" : "false"]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              field.onChange(selected === "true");
            }}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />
    </Form>
  );
}
