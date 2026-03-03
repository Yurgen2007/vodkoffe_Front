import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import Buton from "@/components/molecules/Button";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useUpdateMateriaPrima } from "@/hooks/MateriasPrimas/useMateriaPrima";
import { MateriaPrima, MateriaPrimaUpdate } from "@/types/MateriaPrima";

type Props = {
  materiasPrimas: MateriaPrima[];
  materiaPrimaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({
  materiasPrimas,
  materiaPrimaId,
  id,
  onclose,
}: Props) => {
  const { unidades: unidadesMedida } = useUnidad();
  const updateMateriaPrima = useUpdateMateriaPrima();

  const foundMateriaPrima = materiasPrimas.find(
    (mp) => mp.idMateriaPrima === materiaPrimaId,
  );

  // Obtener el fkUnidadMedida directo
  const getUnidadMedidaId = (): number | undefined => {
    return foundMateriaPrima?.fkUnidadMedida ?? undefined;
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MateriaPrimaUpdate>({
    mode: "onChange",
    defaultValues: {
      nombre: foundMateriaPrima?.nombre || "",
      descripcion: foundMateriaPrima?.descripcion || "",
      costoUnitario: foundMateriaPrima?.costoUnitario || 0,
      fkUnidadMedida: getUnidadMedidaId(),
    },
  });

  useEffect(() => {
    if (foundMateriaPrima) {
      reset({
        nombre: foundMateriaPrima.nombre || "",
        descripcion: foundMateriaPrima.descripcion || "",
        costoUnitario: foundMateriaPrima.costoUnitario || 0,
        fkUnidadMedida: getUnidadMedidaId(),
      });
    }
  }, [foundMateriaPrima, reset]);

  const onSubmit = async (data: MateriaPrimaUpdate) => {
    if (!materiaPrimaId) return;
    try {
      await updateMateriaPrima.mutateAsync({ id: materiaPrimaId, data });
      onclose();
      addToast({
        title: "Actualización Exitosa",
        description: "Materia prima actualizada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo actualizar la materia prima",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
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
        placeholder="Nombre de la materia prima"
        {...register("nombre", { required: "El nombre es requerido" })}
        errorMessage={errors.nombre?.message}
        isInvalid={!!errors.nombre}
      />

      <Input
        label="Descripción"
        placeholder="Descripción de la materia prima"
        {...register("descripcion")}
      />

      <Input
        label="Costo Unitario"
        placeholder="Costo unitario"
        type="number"
        step="0.01"
        {...register("costoUnitario", { 
          valueAsNumber: true,
          min: { value: 0, message: "El costo debe ser mayor o igual a 0" }
        })}
        errorMessage={errors.costoUnitario?.message}
        isInvalid={!!errors.costoUnitario}
      />

      <Controller
        name="fkUnidadMedida"
        control={control}
        defaultValue={getUnidadMedidaId()}
        render={({ field }) => (
          <Select
            label="Unidad de Medida"
            placeholder="Seleccione una unidad de medida"
            selectedKeys={field.value ? new Set([String(field.value)]) : new Set()}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              field.onChange(selected ? Number(selected) : undefined);
            }}
          >
            {(unidadesMedida || []).map((um: any) => (
              <SelectItem key={um.idUnidad} textValue={um.nombre}>
                {um.nombre}
              </SelectItem>
            ))}
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
