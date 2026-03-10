import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UnidadMedidaCreate, UnidadMedidaCreateSchema } from "@/schemas/UnidadMedida";

type FormularioProps = {
  addData: (unidad: UnidadMedidaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioUnidadesMedida({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UnidadMedidaCreate>({
    mode: "onChange",
    resolver: zodResolver(UnidadMedidaCreateSchema),
    defaultValues: {
      nombre: "",
      estado: true as boolean,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await addData({
        nombre: data.nombre,
        estado: data.estado,
      });
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Unidad de medida agregada correctamente",
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
            <SelectItem key="true" textValue="Activo">Activo</SelectItem>
            <SelectItem key="false" textValue="Inactivo">Inactivo</SelectItem>
          </Select>
        )}
      />
    </Form>
  );
}
