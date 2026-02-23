import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import { useLotes } from "@/hooks/Lotes/useLotes";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import Buton from "@/components/molecules/Button";

interface FormUpdateUnidadesProps {
  unidad: any;
  updateData: (id: number, data: any) => Promise<void>;
  onClose: () => void;
  id: string;
}

export default function FormUpdateUnidades({
  unidad,
  updateData,
  onClose,
  id,
}: FormUpdateUnidadesProps) {
  const { data: lotes } = useLotes();
  const { inventarios } = useInventario();
  const { caracteristicas } = useCaracteristica();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  // Resetear el formulario con los valores de la unidad cuando cambia
  useEffect(() => {
    if (unidad) {
      reset({
        codigoUnidad: unidad.codigoUnidad || "",
        fkLote: unidad.fkLote ? String(unidad.fkLote) : undefined,
        fkInventario: unidad.fkInventario ? String(unidad.fkInventario) : undefined,
        fkCaracteristica: unidad.fkCaracteristica ? String(unidad.fkCaracteristica) : undefined,
      });
    }
  }, [unidad, reset]);

  const onSubmit = async (data: any) => {
    try {
      console.log('Datos del formulario:', data);
      console.log('Unidad actual:', unidad);

      const payload: any = {
        codigoUnidad: data.codigoUnidad?.trim() || unidad.codigoUnidad,
      };

      // Solo incluir fkLote si se seleccionó uno
      if (data.fkLote) {
        payload.fkLote = Number(data.fkLote);
      }

      // Solo incluir fkInventario si se seleccionó uno
      if (data.fkInventario) {
        payload.fkInventario = Number(data.fkInventario);
      }

      // Solo incluir fkCaracteristica si se seleccionó una
      if (data.fkCaracteristica) {
        payload.fkCaracteristica = Number(data.fkCaracteristica);
      }

      console.log('Payload a enviar:', payload);
      await updateData(unidad.idUnidad, payload);

      console.log('Actualización exitosa');
      addToast({
        title: "Actualización exitosa",
        description: "Unidad actualizada correctamente",
        color: "success",
      });

      onClose();
    } catch (err) {
      console.error('Error al actualizar:', err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar la unidad",
        color: "danger",
      });
    }
  };

  return (
    <Form className="w-full space-y-4" id={id} onSubmit={handleSubmit(onSubmit)}>
      {/* Input código de unidad */}
      <Input
        label="Código unidad"
        placeholder="Ingrese el código de la unidad"
        {...register("codigoUnidad", { required: "Código requerido" })}
        isInvalid={!!errors.codigoUnidad}
      />

      {/* Selector de Lote */}
      <Controller
        name="fkLote"
        control={control}
        render={({ field }) => (
          <Select
            label="Lote"
            placeholder="Seleccione un lote (opcional)"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(lotes || []).map((lote: any) => (
              <SelectItem key={String(lote.idLote)} textValue={`${lote.codigoLote} (${lote.unidades?.length || 0}/12)`}>
                {lote.codigoLote} ({lote.unidades?.length || 0}/12)
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* Selector de Inventario */}
      <Controller
        name="fkInventario"
        control={control}
        render={({ field }) => (
          <Select
            label="Inventario"
            placeholder="Seleccione un inventario (opcional)"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(inventarios || []).map((inv: any) => (
              <SelectItem key={String(inv.idInventario)}>
                {inv.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {/* Selector de Característica */}
      <Controller
        name="fkCaracteristica"
        control={control}
        render={({ field }) => (
          <Select
            label="Característica"
            placeholder="Seleccione una característica (opcional)"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
          >
            {(caracteristicas || []).map((c: any) => (
              <SelectItem key={String(c.idCaracteristica)}>
                {c.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Buton
        className="w-full rounded-xl"
        isLoading={isSubmitting}
        text="Actualizar"
        type="submit"
      />
    </Form>
  );
}
