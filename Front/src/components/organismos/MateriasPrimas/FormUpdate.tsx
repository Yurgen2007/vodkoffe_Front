import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import Buton from "@/components/molecules/Button";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
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

  const foundMateriaPrima = materiasPrimas.find(
    (mp) => mp.idMateriaPrima === materiaPrimaId,
  );

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
      fkUnidadMedida: foundMateriaPrima?.fkUnidadMedida ?? undefined,
    },
  });

  useEffect(() => {
    if (foundMateriaPrima) {
      reset({
        nombre: foundMateriaPrima.nombre || "",
        descripcion: foundMateriaPrima.descripcion || "",
        costoUnitario: foundMateriaPrima.costoUnitario || 0,
        fkUnidadMedida: foundMateriaPrima.fkUnidadMedida ?? undefined,
      });
    }
  }, [foundMateriaPrima, reset]);

  const onSubmit = async (data: MateriaPrimaUpdate) => {
    console.log(data);
    if (!materiaPrimaId) return;
    try {
      // Aquí iría la llamada al hook de actualización
      // await updateMateriaPrima(materiaPrimaId, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Materia prima actualizada correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la materia prima: ", error);
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
        render={({ field }) => (
          <Select
            label="Unidad de Medida"
            placeholder="Seleccione una unidad de medida"
            selectedKeys={field.value ? [String(field.value)] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              field.onChange(selected ? Number(selected) : undefined);
            }}
          >
            {(unidadesMedida || []).map((um: any) => (
              <SelectItem key={String(um.idUnidad)}>
                {um.nombre} ({um.abreviatura})
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
