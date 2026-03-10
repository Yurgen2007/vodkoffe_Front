import { Form } from "@heroui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useEffect } from "react";

import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { UnidadMedida } from "@/types/UnidadMedida";
import { UnidadMedidaUpdateSchema } from "@/schemas/UnidadMedida";
import Buton from "@/components/molecules/Button";

type Props = {
  unidades: UnidadMedida[];
  unidadId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ unidades, unidadId, id, onclose }: Props) => {
  const { updateUnidad, getUnidadById } = useUnidad();

  const foundUnidad = getUnidadById(unidadId, unidades);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(UnidadMedidaUpdateSchema),
    defaultValues: {
      idUnidad: foundUnidad?.idUnidad ?? 0,
      nombre: foundUnidad?.nombre,
      estado: foundUnidad?.estado ?? true,
    },
  });

  // Actualizar el formulario cuando cambia la unidad seleccionada
  useEffect(() => {
    if (foundUnidad) {
      reset({
        idUnidad: foundUnidad.idUnidad,
        nombre: foundUnidad.nombre,
        estado: foundUnidad.estado,
      });
    }
  }, [foundUnidad, reset]);

  const onSubmit = async (data: any) => {
    console.log(data);
    if (!unidadId) return;
    try {
      await updateUnidad(unidadId, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Unidad actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la unidad : ", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      <Buton type="submit" isLoading={isSubmitting}>
        Actualizar
      </Buton>
    </Form>
  );
};
