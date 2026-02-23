import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { MateriaPrimaCreate, MateriaPrimaCreateSchema } from "@/schemas/MateriaPrima";

type FormularioProps = {
  addData: (data: MateriaPrimaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioMateriasPrimas({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const { unidades: unidadesMedida } = useUnidad();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MateriaPrimaCreate>({
    mode: "onChange",
    resolver: zodResolver(MateriaPrimaCreateSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      costoUnitario: 0,
      estado: true,
      fkUnidadMedida: undefined,
    },
  });

  const onSubmit = async (data: MateriaPrimaCreate) => {
    try {
      await addData({
        nombre: data.nombre,
        descripcion: data.descripcion || undefined,
        costoUnitario: data.costoUnitario || 0,
        estado: data.estado ?? true,
        fkUnidadMedida: data.fkUnidadMedida,
      });
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Materia prima agregada correctamente",
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
    </Form>
  );
}
