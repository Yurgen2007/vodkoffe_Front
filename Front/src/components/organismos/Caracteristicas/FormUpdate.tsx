import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { addToast } from "@heroui/react";

import Buton from "@/components/molecules/Button";
import {
  CaracteristicaUpdate,
  CaracteristicaUpdateSchema,
} from "@/schemas/Caracteristica";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Caracteristica } from "@/types/Caracteristica";

type Props = {
  caracteristicas: Caracteristica[];
  caracteristicaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({
  caracteristicas,
  caracteristicaId,
  id,
  onclose,
}: Props) => {
  const { updateCaracteristica, getCaracteristicaById } = useCaracteristica();

  const foundCaracteristica = getCaracteristicaById(
    caracteristicaId,
    caracteristicas,
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CaracteristicaUpdate>({
    resolver: zodResolver(CaracteristicaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idCaracteristica: foundCaracteristica?.idCaracteristica,
      nombre: foundCaracteristica?.nombre || "",
      descripcion: foundCaracteristica?.descripcion || "",
      estado: foundCaracteristica?.estado ?? true,
    },
  });

  const onSubmit = async (data: CaracteristicaUpdate) => {
    console.log(data);
    if (!data.idCaracteristica) return;
    try {
      await updateCaracteristica(data.idCaracteristica, {
        nombre: data.nombre || "",
        descripcion: data.descripcion,
        estado: data.estado,
      });
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Caracteristica actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la característica: ", error);
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
        placeholder="Nombre...."
        {...register("nombre", { required: "El nombre es requerido" })}
        errorMessage={errors.nombre?.message}
        isInvalid={!!errors.nombre}
      />
      <Input
        label="Descripcion"
        placeholder="Descripcion"
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
            onChange={(e: any) => field.onChange(e.target.value === "true")}
            errorMessage={errors.estado?.message}
            isInvalid={!!errors.estado}
          >
            <SelectItem key="true" textValue="Activo">Activo</SelectItem>
            <SelectItem key="false" textValue="Inactivo">Inactivo</SelectItem>
          </Select>
        )}
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
