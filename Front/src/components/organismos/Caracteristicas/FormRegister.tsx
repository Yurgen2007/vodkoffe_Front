import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CaracteristicaCreate,
  CaracteristicaCreateSchema,
} from "@/schemas/Caracteristica";

type FormularioProps = {
  addData: (tipo: CaracteristicaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioCaracteristicas({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CaracteristicaCreate>({
    resolver: zodResolver(CaracteristicaCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const onSubmit = async (data: CaracteristicaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Caracteristica agregada correctamente",
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
      onSubmit={handleSubmit(onSubmit) as any}
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        type="text"
        {...register("nombre", { required: "El nombre es requerido" })}
        errorMessage={errors.nombre?.message}
        isInvalid={!!errors.nombre}
      />
      <Input
        label="Descripcion"
        placeholder="Descripcion"
        type="text"
        {...register("descripcion")}
        errorMessage={errors.descripcion?.message}
        isInvalid={!!errors.descripcion}
      />
      <Controller
        name="estado"
        control={control}
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Selecciona estado"
            selectedKeys={[field.value ? "true" : "false"]}
            onChange={(e) => field.onChange(e.target.value === "true")}
            errorMessage={errors.estado?.message}
            isInvalid={!!errors.estado}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />
    </Form>
  );
}
