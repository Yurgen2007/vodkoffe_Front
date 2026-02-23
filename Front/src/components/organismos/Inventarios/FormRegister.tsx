import { Form } from "@heroui/react";
import { addToast, Input } from "@heroui/react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InventarioCreate, InventarioCreateSchema } from "@/schemas/Inventario";

type FormularioProps = {
  addData: (inventario: InventarioCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioInventario({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InventarioCreate>({
    mode: "onChange",
    resolver: zodResolver(InventarioCreateSchema),
    defaultValues: {
      nombre: "",
      estado: true,
    },
  });

  const onSubmit: SubmitHandler<InventarioCreate> = async (data) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Inventario creado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el inventario:", error);
    }
  };

  console.log("Errores", errors);

  return (
    <Form
      className="w-full space-y-4"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="nombre"
        render={({ field }) => (
          <Input
            {...field}
            isInvalid={!!errors.nombre}
            errorMessage={errors.nombre?.message}
            label="Nombre"
            placeholder="Ingresa el nombre del inventario"
          />
        )}
      />
    </Form>
  );
}
